import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import {
  applyToUpdateRecorder,
  NoopChange,
} from '@schematics/angular/utility/change';
import { getEOL } from '@schematics/angular/utility/eol';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import ts from 'typescript';

import { parseSourceFile } from '../../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../../utility/visit-project-files';

const MODULE_NAME = '@skyux/i18n';

const CLASS_NAMES: Record<string, string> = {
  SkyAppResourcesService: 'SkyAppResourcesLegacyService',
  SkyLibResourcesService: 'SkyLibResourcesLegacyService',
};

/**
 * The declarations that can shadow a service class name in a file, and so rule
 * that name out for an inserted provider.
 */
const DECLARATION_KINDS = new Set<ts.SyntaxKind>([
  ts.SyntaxKind.ImportClause,
  ts.SyntaxKind.NamespaceImport,
  ts.SyntaxKind.ImportEqualsDeclaration,
  ts.SyntaxKind.ClassDeclaration,
  ts.SyntaxKind.ClassExpression,
  ts.SyntaxKind.InterfaceDeclaration,
  ts.SyntaxKind.TypeAliasDeclaration,
  ts.SyntaxKind.TypeParameter,
  ts.SyntaxKind.EnumDeclaration,
  ts.SyntaxKind.ModuleDeclaration,
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.FunctionExpression,
  ts.SyntaxKind.VariableDeclaration,
  ts.SyntaxKind.Parameter,
  ts.SyntaxKind.BindingElement,
]);

/**
 * Whether the reference is the `SkyLibResourcesService.addResources()` static
 * call. Only the observables returned by the instance methods changed, so
 * static calls -- which generated resources modules rely on -- are left alone.
 */
function isStaticAddResourcesReference(node: ts.Identifier): boolean {
  const parent = node.parent;

  return (
    ts.isPropertyAccessExpression(parent) &&
    parent.expression === node &&
    parent.name.text === 'addResources'
  );
}

function isWrappedExpression(
  node: ts.Node,
): node is
  | ts.ParenthesizedExpression
  | ts.AssertionExpression
  | ts.SatisfiesExpression
  | ts.NonNullExpression {
  return (
    ts.isParenthesizedExpression(node) ||
    ts.isAssertionExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isNonNullExpression(node)
  );
}

function getOuterExpression(node: ts.Node): ts.Node {
  while (isWrappedExpression(node.parent)) {
    node = node.parent;
  }
  return node;
}

/**
 * The provider object literal in which `node` is the value of `propertyName`,
 * e.g. `{ provide: SkyAppResourcesService, ... }` for `provide`, or
 * `undefined` when `node` sits anywhere else.
 */
function getProviderObjectLiteral(
  node: ts.Identifier,
  propertyName: string,
): ts.ObjectLiteralExpression | undefined {
  const expression = getOuterExpression(node);
  const propertyAssignment = expression.parent;

  if (
    !ts.isPropertyAssignment(propertyAssignment) ||
    propertyAssignment.initializer !== expression ||
    propertyAssignment.name.getText() !== propertyName
  ) {
    return undefined;
  }

  return propertyAssignment.parent;
}

/**
 * The array elements through which `objectLiteral` reaches a
 * `providers: [...]` list -- the object literal itself when it's written
 * inline, or every reference to the variable it was assigned to, e.g.
 * `const resourcesProvider = { provide: SkyAppResourcesService, ... };` used
 * as `providers: [resourcesProvider]`. Empty when the object never reaches an
 * array.
 */
function getProviderArrayElements(
  objectLiteral: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
): ts.Node[] {
  const expression = getOuterExpression(objectLiteral);

  if (ts.isArrayLiteralExpression(expression.parent)) {
    return [expression];
  }

  const variable = expression.parent;

  if (!ts.isVariableDeclaration(variable) || !ts.isIdentifier(variable.name)) {
    return [];
  }

  const variableName = variable.name.text;

  return findNodes(sourceFile, ts.SyntaxKind.Identifier)
    .filter(
      (reference): reference is ts.Identifier =>
        ts.isIdentifier(reference) &&
        reference.text === variableName &&
        reference !== variable.name &&
        checker.getSymbolAtLocation(reference) ===
          checker.getSymbolAtLocation(variable.name),
    )
    .map(getOuterExpression)
    .filter((element) => ts.isArrayLiteralExpression(element.parent));
}

/**
 * The array elements after which `token`'s legacy twin provider belongs, or
 * an empty array when `token` isn't the `provide:` token of a provider that
 * reaches a `providers: [...]` list.
 */
function getTwinInsertionPoints(
  token: ts.Identifier,
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
): ts.Node[] {
  const objectLiteral = getProviderObjectLiteral(token, 'provide');

  return objectLiteral
    ? getProviderArrayElements(objectLiteral, sourceFile, checker)
    : [];
}

function isImportedService(
  node: ts.Identifier,
  className: string,
  checker: ts.TypeChecker,
): boolean {
  const symbol = ts.isShorthandPropertyAssignment(node.parent)
    ? checker.getShorthandAssignmentValueSymbol(node.parent)
    : ts.isExportSpecifier(node.parent)
      ? checker.getExportSpecifierLocalTargetSymbol(node.parent)
      : checker.getSymbolAtLocation(node);

  return (
    symbol?.declarations?.some(
      (declaration) =>
        ts.isImportSpecifier(declaration) &&
        (declaration.propertyName ?? declaration.name).text === className &&
        ts.isStringLiteral(declaration.parent.parent.parent.moduleSpecifier) &&
        declaration.parent.parent.parent.moduleSpecifier.text === MODULE_NAME,
    ) ?? false
  );
}

/**
 * Whether `objectLiteral` is a provider whose `provide` token is
 * the imported legacy service, including an existing aliased import.
 */
function isLegacyProvider(
  objectLiteral: ts.ObjectLiteralExpression,
  legacyClassName: string,
  checker: ts.TypeChecker,
): boolean {
  return objectLiteral.properties.some((property) => {
    if (
      !ts.isPropertyAssignment(property) ||
      property.name.getText() !== 'provide'
    ) {
      return false;
    }

    let token = property.initializer;
    while (isWrappedExpression(token)) {
      token = token.expression;
    }

    return (
      ts.isIdentifier(token) &&
      isImportedService(token, legacyClassName, checker)
    );
  });
}

/**
 * Whether the reference is a provider token that must not be renamed: either
 * the `provide:` token of a provider registered in a `providers: [...]` list,
 * or the `useExisting:` token of a legacy provider alias.
 * The `provide:` token is duplicated rather than renamed -- see
 * `duplicateProviderTokens` -- since test doubles registered under the
 * original token would otherwise stop matching the pipe and matchers that
 * still inject it, and the twin's `useExisting:` token has to keep pointing at
 * it. An existing legacy provider alias must likewise keep that target to
 * avoid aliasing the legacy service to itself. Any other `useExisting:` token
 * is a consumer's own alias, and its injectors expect the legacy behavior,
 * so it is renamed like a normal
 * reference.
 */
function isProviderToken(
  node: ts.Identifier,
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
): boolean {
  const useExistingLiteral = getProviderObjectLiteral(node, 'useExisting');
  const objectLiteral =
    getProviderObjectLiteral(node, 'provide') ??
    (useExistingLiteral &&
    isLegacyProvider(useExistingLiteral, CLASS_NAMES[node.text], checker)
      ? useExistingLiteral
      : undefined);

  return (
    !!objectLiteral &&
    getProviderArrayElements(objectLiteral, sourceFile, checker).length > 0
  );
}

/**
 * The whitespace between the start of `node`'s line and `node` itself, used
 * to indent an inserted sibling the same as the node it follows. Returns
 * `undefined` when `node` isn't the first thing on its line (e.g. a
 * single-line `providers: [{ provide: X, ... }]`) -- the text preceding it
 * on the line is code, not indentation, and repeating it would corrupt the
 * file.
 */
function getLineIndent(
  node: ts.Node,
  sourceFile: ts.SourceFile,
): string | undefined {
  const text = sourceFile.text;
  const lineStart = text.lastIndexOf('\n', node.getStart() - 1) + 1;
  const prefix = text.slice(lineStart, node.getStart());
  return /^\s*$/.test(prefix) ? prefix : undefined;
}

/**
 * The provider object literal `element` stands for: the element itself when
 * the provider is written inline, or the object literal the variable was
 * initialized with, e.g. `const legacyProvider = { ... };` listed as
 * `providers: [legacyProvider]`.
 */
function getProviderFromArrayElement(
  element: ts.Expression,
  checker: ts.TypeChecker,
): ts.ObjectLiteralExpression | undefined {
  while (isWrappedExpression(element)) {
    element = element.expression;
  }

  if (ts.isObjectLiteralExpression(element)) {
    return element;
  }

  if (!ts.isIdentifier(element)) {
    return undefined;
  }

  const declaration = checker.getSymbolAtLocation(element)?.valueDeclaration;
  let initializer =
    declaration && ts.isVariableDeclaration(declaration)
      ? declaration.initializer
      : undefined;

  while (initializer && isWrappedExpression(initializer)) {
    initializer = initializer.expression;
  }

  return initializer && ts.isObjectLiteralExpression(initializer)
    ? initializer
    : undefined;
}

/**
 * Whether `array` already lists a provider whose `provide` token is
 * the legacy service, either inline or through a variable. Keeps the migration
 * idempotent: re-running it, or running it against a file someone already
 * hand-fixed, doesn't add a second twin. It also keeps an explicit legacy
 * provider's precedence -- the last provider for a token wins, so a twin
 * inserted after it would override it.
 */
function arrayHasLegacyProvider(
  array: ts.ArrayLiteralExpression,
  legacyClassName: string,
  checker: ts.TypeChecker,
): boolean {
  return array.elements.some((element) => {
    const provider = getProviderFromArrayElement(element, checker);

    return !!provider && isLegacyProvider(provider, legacyClassName, checker);
  });
}

/**
 * Whether `specifier` imports `className` from `MODULE_NAME`.
 * Such a binding can be reused; an import of a different service cannot.
 */
function isServiceImportSpecifier(
  specifier: ts.ImportSpecifier,
  className: string,
): boolean {
  const moduleSpecifier = specifier.parent.parent.parent.moduleSpecifier;

  return (
    ts.isStringLiteral(moduleSpecifier) &&
    moduleSpecifier.text === MODULE_NAME &&
    (specifier.propertyName ?? specifier.name).text === className
  );
}

/**
 * The name `node` binds, when it's a declaration that binds one. Covers the
 * declarations that could shadow a service class name; import specifiers are
 * handled separately, since the migration's own are exempt.
 */
function getDeclaredName(node: ts.Node): string | undefined {
  if (!DECLARATION_KINDS.has(node.kind)) {
    return undefined;
  }

  const name = (node as ts.NamedDeclaration).name;

  // A destructured variable declares a binding pattern rather than a name.
  return name?.kind === ts.SyntaxKind.Identifier
    ? (name as ts.Identifier).text
    : undefined;
}

/**
 * Every name `sourceFile` binds, apart from `className` imports
 * from `MODULE_NAME`. An inserted provider can't reference a service class
 * under a name in this set -- the file already means something else by it.
 */
function getBoundNames(
  sourceFile: ts.SourceFile,
  className: string,
): Set<string> {
  const names = new Set<string>();

  const visit = (node: ts.Node): void => {
    if (ts.isImportSpecifier(node)) {
      if (!isServiceImportSpecifier(node, className)) {
        names.add(node.name.text);
      }

      return;
    }

    const declaredName = getDeclaredName(node);

    if (declaredName) {
      names.add(declaredName);
    }

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile, visit);

  return names;
}

/**
 * The name to reference each service class by in `sourceFile`, keyed by its
 * exported name. Normally the class name itself, but a suffixed
 * alias when the file already binds that name to something of its own -- the
 * inserted provider and its import would otherwise redeclare it.
 */
function getServiceLocalNames(
  sourceFile: ts.SourceFile,
): Record<string, string> {
  const localNames: Record<string, string> = {};

  Object.entries(CLASS_NAMES)
    .flat()
    .forEach((className) => {
      const boundNames = getBoundNames(sourceFile, className);
      let localName = className;
      let suffix = 0;

      while (boundNames.has(localName)) {
        suffix += 1;
        localName = `${className}_${suffix}`;
      }

      localNames[className] = localName;
    });

  return localNames;
}

/**
 * For every `provide:` token referencing a renamed class, inserts a twin
 * provider aliasing the legacy class to it, e.g.
 * `{ provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService }`
 * gets a
 * `{ provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService }`
 * sibling. `useExisting` rather than a copy of the original provider's
 * configuration: both tokens must resolve to the same instance, which copying
 * a `useClass` or `useFactory` provider would not do. Returns the imports the
 * twins require, including an alias for an original token when its name is
 * shadowed at a provider variable's use site.
 */
function duplicateProviderTokens(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  eol: string,
  localNames: Record<string, string>,
  checker: ts.TypeChecker,
): Map<string, string> {
  const requiredImports = new Map<string, string>();

  Object.entries(CLASS_NAMES).forEach(([oldClassName, legacyClassName]) => {
    const legacyLocalName = localNames[legacyClassName];
    const originalLocalName = localNames[oldClassName];

    const tokens = findNodes(sourceFile, ts.SyntaxKind.Identifier).filter(
      (node): node is ts.Identifier =>
        ts.isIdentifier(node) &&
        node.text === oldClassName &&
        isImportedService(node, oldClassName, checker),
    );

    tokens.forEach((token) => {
      getTwinInsertionPoints(token, sourceFile, checker).forEach((element) => {
        const array = element.parent as ts.ArrayLiteralExpression;

        if (arrayHasLegacyProvider(array, legacyClassName, checker)) {
          return;
        }

        const indent = getLineIndent(element, sourceFile);
        const separator = indent === undefined ? ' ' : `${eol}${indent}`;

        recorder.insertRight(
          element.getEnd(),
          `,${separator}{ provide: ${legacyLocalName}, useExisting: ${originalLocalName} }`,
        );
        requiredImports.set(legacyClassName, legacyLocalName);
        if (originalLocalName !== oldClassName) {
          requiredImports.set(oldClassName, originalLocalName);
        }
      });
    });
  });

  return requiredImports;
}

/**
 * The named import binding `className` from `MODULE_NAME` as
 * `localName`, if the file has one. The specifier may be type-only, which
 * doesn't satisfy the inserted provider -- see `ensureServiceImport`.
 */
function findServiceImportSpecifier(
  sourceFile: ts.SourceFile,
  className: string,
  localName: string,
): ts.ImportSpecifier | undefined {
  for (const node of findNodes(sourceFile, ts.SyntaxKind.ImportDeclaration)) {
    if (
      !ts.isImportDeclaration(node) ||
      !ts.isStringLiteral(node.moduleSpecifier) ||
      node.moduleSpecifier.text !== MODULE_NAME
    ) {
      continue;
    }

    const namedBindings = node.importClause?.namedBindings;

    if (!namedBindings || !ts.isNamedImports(namedBindings)) {
      continue;
    }

    const specifier = namedBindings.elements.find(
      (element) =>
        (element.propertyName ?? element.name).text === className &&
        element.name.text === localName,
    );

    if (specifier) {
      return specifier;
    }
  }

  return undefined;
}

/**
 * Whether `specifier` only brings in a type, either through
 * `import type { X }` or `import { type X }`.
 */
function isTypeOnlyImport(specifier: ts.ImportSpecifier): boolean {
  return specifier.isTypeOnly || specifier.parent.parent.isTypeOnly;
}

/**
 * Turns a type-only import of `specifier` into a value import by dropping its
 * `type` keyword. Adding a second declaration for a name the file already
 * binds would be a duplicate identifier.
 */
function removeTypeKeyword(
  recorder: UpdateRecorder,
  specifier: ts.ImportSpecifier,
): void {
  const [typeKeywordStart, bindingStart] = specifier.isTypeOnly
    ? [
        specifier.getStart(),
        (specifier.propertyName ?? specifier.name).getStart(),
      ]
    : [specifier.parent.parent.getStart(), specifier.parent.getStart()];

  recorder.remove(typeKeywordStart, bindingStart - typeKeywordStart);
}

/**
 * Adds an import declaration of its own after the file's last import, for the
 * cases `insertImport` can't merge into an existing one.
 */
function insertImportDeclaration(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  className: string,
  localName: string,
): void {
  const endOfImports = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).reduce((max, node) => Math.max(max, node.getEnd()), 0);

  const binding =
    localName === className ? className : `${className} as ${localName}`;

  recorder.insertRight(
    endOfImports,
    `${getEOL(sourceFile.text)}import { ${binding} } from '${MODULE_NAME}';`,
  );
}

/**
 * Binds `className` as a value from `MODULE_NAME` under `localName` so
 * the twin providers `duplicateProviderTokens` inserted resolve.
 * `swapImportedClass` adds the legacy import itself whenever it renames a
 * non-provider reference. Original tokens can also need an unshadowed alias,
 * and an existing type-only import must become a value import.
 */
function ensureServiceImport(
  tree: Tree,
  filePath: string,
  className: string,
  localName: string,
): void {
  const sourceFile = parseSourceFile(tree, filePath);
  const specifier = findServiceImportSpecifier(
    sourceFile,
    className,
    localName,
  );

  if (specifier && !isTypeOnlyImport(specifier)) {
    return;
  }

  const recorder = tree.beginUpdate(filePath);

  if (specifier) {
    removeTypeKeyword(recorder, specifier);
  } else {
    // `insertImport` no-ops when the module is already bound under another
    // name -- an alias, or a namespace import -- so a declaration of our own
    // is the fallback.
    const change = insertImport(
      sourceFile,
      filePath,
      className,
      MODULE_NAME,
      false,
      localName === className ? undefined : localName,
    );

    if (change instanceof NoopChange) {
      insertImportDeclaration(recorder, sourceFile, className, localName);
    } else {
      applyToUpdateRecorder(recorder, [change]);
    }
  }

  tree.commitUpdate(recorder);
}

async function updateSourceFiles(tree: Tree): Promise<void> {
  const workspace = await getWorkspace(tree);

  workspace.projects.forEach((project) => {
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      if (!filePath.endsWith('.ts')) {
        return;
      }

      const content = tree.readText(filePath);

      if (!Object.keys(CLASS_NAMES).some((name) => content.includes(name))) {
        return;
      }

      const sourceFile = parseSourceFile(tree, filePath);
      // Only local bindings are needed; do not load dependencies or lib files.
      const options: ts.CompilerOptions = {
        noLib: true,
        noResolve: true,
        types: [],
      };
      const checker = ts
        .createProgram([sourceFile.fileName], options, {
          ...ts.createCompilerHost(options),
          getSourceFile: () => sourceFile,
        })
        .getTypeChecker();
      const localNames = getServiceLocalNames(sourceFile);
      const recorder = tree.beginUpdate(filePath);

      swapImportedClass(recorder, filePath, sourceFile, [
        {
          classNames: CLASS_NAMES,
          moduleName: MODULE_NAME,
          localNames,
          filter: (node): boolean =>
            isImportedService(node, node.text, checker) &&
            !isStaticAddResourcesReference(node) &&
            !isProviderToken(node, sourceFile, checker),
        },
      ]);

      const requiredImports = duplicateProviderTokens(
        recorder,
        sourceFile,
        getEOL(sourceFile.text),
        localNames,
        checker,
      );

      tree.commitUpdate(recorder);

      requiredImports.forEach((localName, className) => {
        ensureServiceImport(tree, filePath, className, localName);
      });
    });
  });
}

/**
 * Replaces the resources services with their "legacy" equivalents, which emit
 * once and complete. The original services now emit again whenever the
 * locale changes.
 *
 * A `provide:` token inside a `providers: [...]` array (e.g. a test's
 * `TestBed.configureTestingModule`) is duplicated instead of renamed: the
 * original provider stays, and a `useExisting` twin for the legacy token is
 * added right after it unless that array already provides the legacy service.
 * Provider variables are resolved within their lexical scope, including
 * parenthesized expressions, type assertions, and `satisfies` expressions.
 * The `skyAppResources` pipe and the `toHaveResourceText`/`toEqualResourceText`
 * matchers still inject the
 * original service, so renaming the provider outright would leave them
 * resolving against the real, un-mocked service.
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void> => {
    await updateSourceFiles(tree);
  };
}
