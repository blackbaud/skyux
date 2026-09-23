import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import {
  applyToUpdateRecorder,
  NoopChange,
} from '@schematics/angular/utility/change';
import { getEOL } from '@schematics/angular/utility/eol';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import ts from 'typescript';

import {
  getLocalImportName,
  parseSourceFile,
} from '../../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../../utility/visit-project-files';

const MODULE_NAME = '@skyux/i18n';

const CLASS_NAMES: Record<string, string> = {
  SkyAppResourcesService: 'SkyAppResourcesLegacyService',
  SkyLibResourcesService: 'SkyLibResourcesLegacyService',
};

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

/**
 * The provider object literal in which `node` is the value of `propertyName`,
 * e.g. `{ provide: SkyAppResourcesService, ... }` for `provide`, or
 * `undefined` when `node` sits anywhere else.
 */
function getProviderObjectLiteral(
  node: ts.Identifier,
  propertyName: string,
): ts.ObjectLiteralExpression | undefined {
  const propertyAssignment = node.parent;

  if (
    !ts.isPropertyAssignment(propertyAssignment) ||
    propertyAssignment.initializer !== node ||
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
): ts.Node[] {
  if (ts.isArrayLiteralExpression(objectLiteral.parent)) {
    return [objectLiteral];
  }

  const variable = objectLiteral.parent;

  if (!ts.isVariableDeclaration(variable) || !ts.isIdentifier(variable.name)) {
    return [];
  }

  const variableName = variable.name.text;

  return findNodes(sourceFile, ts.SyntaxKind.Identifier).filter(
    (reference): reference is ts.Identifier =>
      ts.isIdentifier(reference) &&
      reference.text === variableName &&
      reference !== variable.name &&
      ts.isArrayLiteralExpression(reference.parent),
  );
}

/**
 * The array elements after which `token`'s legacy twin provider belongs, or
 * an empty array when `token` isn't the `provide:` token of a provider that
 * reaches a `providers: [...]` list.
 */
function getTwinInsertionPoints(
  token: ts.Identifier,
  sourceFile: ts.SourceFile,
): ts.Node[] {
  const objectLiteral = getProviderObjectLiteral(token, 'provide');

  return objectLiteral
    ? getProviderArrayElements(objectLiteral, sourceFile)
    : [];
}

/**
 * Whether `objectLiteral` is a provider whose `provide` token is
 * `legacyClassName`, i.e. the twin `duplicateProviderTokens` inserts.
 */
function isLegacyProvider(
  objectLiteral: ts.ObjectLiteralExpression,
  legacyClassName: string,
): boolean {
  return objectLiteral.properties.some(
    (property) =>
      ts.isPropertyAssignment(property) &&
      property.name.getText() === 'provide' &&
      ts.isIdentifier(property.initializer) &&
      property.initializer.text === legacyClassName,
  );
}

/**
 * Whether the reference is a provider token that must not be renamed: either
 * the `provide:` token of a provider registered in a `providers: [...]` list,
 * or the `useExisting:` token of the legacy twin that duplication inserts.
 * The `provide:` token is duplicated rather than renamed -- see
 * `duplicateProviderTokens` -- since test doubles registered under the
 * original token would otherwise stop matching the pipe and matchers that
 * still inject it, and the twin's `useExisting:` token has to keep pointing at
 * it. Any other `useExisting:` token is a consumer's own alias, and its
 * injectors expect the legacy behavior, so it is renamed like a normal
 * reference.
 */
function isProviderToken(
  node: ts.Identifier,
  sourceFile: ts.SourceFile,
): boolean {
  const useExistingLiteral = getProviderObjectLiteral(node, 'useExisting');
  const objectLiteral =
    getProviderObjectLiteral(node, 'provide') ??
    (useExistingLiteral &&
    isLegacyProvider(useExistingLiteral, CLASS_NAMES[node.text])
      ? useExistingLiteral
      : undefined);

  return (
    !!objectLiteral &&
    getProviderArrayElements(objectLiteral, sourceFile).length > 0
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
 * Whether `array` already contains a provider object literal whose `provide`
 * token is `legacyClassName`. Keeps the migration idempotent: re-running it,
 * or running it against a file someone already hand-fixed, doesn't add a
 * second twin.
 */
function arrayHasLegacyProvider(
  array: ts.ArrayLiteralExpression,
  legacyClassName: string,
): boolean {
  return array.elements.some(
    (element) =>
      ts.isObjectLiteralExpression(element) &&
      isLegacyProvider(element, legacyClassName),
  );
}

/**
 * For every `provide:` token referencing a renamed class, inserts a twin
 * provider aliasing the legacy class to it, e.g.
 * `{ provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService }`
 * gets a
 * `{ provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService }`
 * sibling. `useExisting` rather than a copy of the original provider's
 * configuration: both tokens must resolve to the same instance, which copying
 * a `useClass` or `useFactory` provider would not do. Returns the legacy class
 * names that received a twin, so the caller can ensure each one is imported.
 */
function duplicateProviderTokens(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  eol: string,
): Set<string> {
  const twinnedClassNames = new Set<string>();

  Object.entries(CLASS_NAMES).forEach(([oldClassName, legacyClassName]) => {
    // A same-named class imported from another module is a different token
    // and must not gain a legacy twin.
    if (
      getLocalImportName(sourceFile, oldClassName, MODULE_NAME) !== oldClassName
    ) {
      return;
    }

    const tokens = findNodes(sourceFile, ts.SyntaxKind.Identifier).filter(
      (node): node is ts.Identifier =>
        ts.isIdentifier(node) && node.text === oldClassName,
    );

    tokens.forEach((token) => {
      getTwinInsertionPoints(token, sourceFile).forEach((element) => {
        const array = element.parent as ts.ArrayLiteralExpression;

        if (arrayHasLegacyProvider(array, legacyClassName)) {
          return;
        }

        const indent = getLineIndent(element, sourceFile);
        const separator = indent === undefined ? ' ' : `${eol}${indent}`;

        recorder.insertRight(
          element.getEnd(),
          `,${separator}{ provide: ${legacyClassName}, useExisting: ${oldClassName} }`,
        );
        twinnedClassNames.add(legacyClassName);
      });
    });
  });

  return twinnedClassNames;
}

/**
 * The named import of `legacyClassName` from `MODULE_NAME`, if the file has
 * one. The specifier may be type-only or bound under an alias, neither of
 * which satisfies the inserted provider -- see `ensureLegacyImport`.
 */
function findLegacyImportSpecifier(
  sourceFile: ts.SourceFile,
  legacyClassName: string,
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
        (element.propertyName ?? element.name).text === legacyClassName,
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
  legacyClassName: string,
): void {
  const endOfImports = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).reduce((max, node) => Math.max(max, node.getEnd()), 0);

  recorder.insertRight(
    endOfImports,
    `${getEOL(sourceFile.text)}import { ${legacyClassName} } from '${MODULE_NAME}';`,
  );
}

/**
 * Binds `legacyClassName` as a value from `MODULE_NAME` so the twin providers
 * `duplicateProviderTokens` inserted resolve. `swapImportedClass` adds the
 * legacy import itself whenever it renames a non-provider reference, so this
 * only has work to do when every other reference to the class was a provider
 * token, or when the file's existing import can't be used as a value.
 */
function ensureLegacyImport(
  tree: Tree,
  filePath: string,
  legacyClassName: string,
): void {
  const sourceFile = parseSourceFile(tree, filePath);
  const specifier = findLegacyImportSpecifier(sourceFile, legacyClassName);
  const isBoundToLegacyName = specifier?.name.text === legacyClassName;

  if (specifier && isBoundToLegacyName && !isTypeOnlyImport(specifier)) {
    return;
  }

  const recorder = tree.beginUpdate(filePath);

  if (specifier && isBoundToLegacyName) {
    removeTypeKeyword(recorder, specifier);
  } else {
    // An alias binds the class under another name, so `insertImport` has
    // nothing to merge into -- and it no-ops outright when the file has a
    // namespace import of the module.
    const change = specifier
      ? undefined
      : insertImport(sourceFile, filePath, legacyClassName, MODULE_NAME);

    if (change && !(change instanceof NoopChange)) {
      applyToUpdateRecorder(recorder, [change]);
    } else {
      insertImportDeclaration(recorder, sourceFile, legacyClassName);
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
      const recorder = tree.beginUpdate(filePath);

      swapImportedClass(recorder, filePath, sourceFile, [
        {
          classNames: CLASS_NAMES,
          moduleName: MODULE_NAME,
          filter: (node): boolean =>
            !isStaticAddResourcesReference(node) &&
            !isProviderToken(node, sourceFile),
        },
      ]);

      const twinnedClassNames = duplicateProviderTokens(
        recorder,
        sourceFile,
        getEOL(sourceFile.text),
      );

      tree.commitUpdate(recorder);

      twinnedClassNames.forEach((legacyClassName) => {
        ensureLegacyImport(tree, filePath, legacyClassName);
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
 * added right after it. The `skyAppResources` pipe and the
 * `toHaveResourceText`/`toEqualResourceText` matchers still inject the
 * original service, so renaming the provider outright would leave them
 * resolving against the real, un-mocked service.
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void> => {
    await updateSourceFiles(tree);
  };
}
