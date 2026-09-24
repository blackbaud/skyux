import { UpdateRecorder } from '@angular-devkit/schematics';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getEOL } from '@schematics/angular/utility/eol';
import ts from 'typescript';

import { isImportedFromPackage } from './ng-ast';
import { removeImport } from './remove-import';

export interface SwapImportedClassOptions {
  classNames: Record<string, string | string[]>;
  moduleName: string | { old: string; new: string };
  filter?: (node: ts.Identifier) => boolean;
  /**
   * The name to reference a new class by in this file, keyed by its exported
   * name, for files that already bind that exported name to something else.
   * The inserted import keeps the exported name and aliases it to the local
   * name, e.g. `import { SkyThing as SkyThing_1 }`.
   */
  localNames?: Record<string, string>;
}

function findReferences(
  sourceFile: ts.SourceFile,
  className: string,
): ts.Identifier[] {
  return findNodes(sourceFile, ts.SyntaxKind.Identifier).filter(
    (node): node is ts.Identifier =>
      ts.isIdentifier(node) && node.text === className,
  );
}

function getNamespaceImportNames(sourceFile: ts.SourceFile): string[] {
  return findNodes(sourceFile, ts.SyntaxKind.ImportDeclaration).flatMap(
    (node) => {
      if (!ts.isImportDeclaration(node)) {
        return [];
      }

      const clause = node.importClause;
      const bindings = clause?.namedBindings;

      return clause && bindings && ts.isNamespaceImport(bindings)
        ? [bindings.name.text]
        : [];
    },
  );
}

function getLeftmostIdentifier(node: ts.Node): ts.Identifier | undefined {
  let current = node;

  while (
    ts.isPropertyAccessExpression(current) ||
    ts.isQualifiedName(current)
  ) {
    current = ts.isPropertyAccessExpression(current)
      ? current.expression
      : current.left;
  }

  return ts.isIdentifier(current) ? current : undefined;
}

function isNamespaceQualifiedReference(
  reference: ts.Identifier,
  namespaceNames: string[],
): boolean {
  const parent = reference.parent;

  // Value position, e.g. `namespace.SkyThing`; type position, e.g.
  // `let thing: namespace.SkyThing`.
  const qualifier =
    ts.isPropertyAccessExpression(parent) && parent.name === reference
      ? parent.expression
      : ts.isQualifiedName(parent) && parent.right === reference
        ? parent.left
        : undefined;

  if (!qualifier) {
    return false;
  }

  const namespace = getLeftmostIdentifier(qualifier);

  return !!namespace && namespaceNames.includes(namespace.text);
}

function swapReference(
  recorder: UpdateRecorder,
  reference: ts.Identifier,
  newClassName: string,
): void {
  const start = reference.getStart();
  recorder.remove(start, reference.getWidth());
  recorder.insertRight(start, newClassName);
}

function shiftLineBreakForInsertedImport(
  change: InsertChange,
  eol: string,
): void {
  if (change.toAdd.startsWith(`;${eol}import `)) {
    // If the import is added after a semicolon, we need to remove the semicolon.
    change.toAdd = change.toAdd.substring(`;${eol}`.length) + `;${eol}`;
    change.pos += `;${eol}`.length;
  }
}

function getModuleName(
  moduleName: string | { old: string; new: string },
  field: 'old' | 'new',
): string {
  return typeof moduleName === 'object' ? moduleName[field] : moduleName;
}

export function swapImportedClass(
  recorder: UpdateRecorder,
  filePath: string,
  sourceFile: ts.SourceFile,
  options: SwapImportedClassOptions[],
): void {
  const eol = getEOL(sourceFile.text);
  const applicableOptions = options.filter((option) =>
    Object.keys(option.classNames).some((className) =>
      typeof option.moduleName === 'object'
        ? isImportedFromPackage(sourceFile, className, option.moduleName.old)
        : isImportedFromPackage(sourceFile, className, option.moduleName),
    ),
  );
  if (applicableOptions.length === 0) {
    return;
  }

  const endOfImports = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).reduce((max, node) => Math.max(max, node.getEnd()), 0);
  const namespaceImportNames = getNamespaceImportNames(sourceFile);

  // `insertImport` reads the original AST, so inserts are batched per module
  // and applied once below. Applying them as they are found would emit a
  // separate import statement for every class name.
  const addImports: Record<string, string[]> = {};
  const removeImports: Record<string, string[]> = {};
  applicableOptions.forEach((option) => {
    const { classNames, moduleName, filter, localNames } = option;
    const oldModuleName = getModuleName(moduleName, 'old');
    const newModuleName = getModuleName(moduleName, 'new');
    const toLocalName = (name: string): string => localNames?.[name] ?? name;
    const toImportBinding = (name: string): string =>
      toLocalName(name) === name ? name : `${name} as ${toLocalName(name)}`;
    Object.entries(classNames).forEach(([oldClassName, newClassName]) => {
      const referencesInCode = findReferences(sourceFile, oldClassName).filter(
        (reference) => reference.getStart() > endOfImports,
      );
      const referencesInCodeWithoutNamespaces = referencesInCode.filter(
        (reference) =>
          !isNamespaceQualifiedReference(reference, namespaceImportNames),
      );
      const referencesFiltered = referencesInCode.filter(
        (reference) =>
          (filter ?? ((): boolean => true))(reference) &&
          !isNamespaceQualifiedReference(reference, namespaceImportNames),
      );
      const newClassNameString = (
        Array.isArray(newClassName) ? newClassName : [newClassName]
      )
        .map(toLocalName)
        .join(', ');
      referencesFiltered.forEach((reference) => {
        swapReference(recorder, reference, newClassNameString);
      });
      if (referencesFiltered.length > 0) {
        const allReferencesToBeReplaced =
          referencesFiltered.length ===
          referencesInCodeWithoutNamespaces.length;
        const newClassNameArray = Array.isArray(newClassName)
          ? newClassName
          : [newClassName];

        const missingClassNames = newClassNameArray.filter((name) =>
          localNames?.[name]
            ? !findNodes(sourceFile, ts.SyntaxKind.ImportSpecifier).some(
                (node) =>
                  ts.isImportSpecifier(node) &&
                  (node.propertyName ?? node.name).text === name &&
                  node.name.text === toLocalName(name) &&
                  ts.isStringLiteral(
                    node.parent.parent.parent.moduleSpecifier,
                  ) &&
                  node.parent.parent.parent.moduleSpecifier.text ===
                    newModuleName,
              )
            : !isImportedFromPackage(sourceFile, name, newModuleName),
        );
        const missingImportBindings = missingClassNames.map(toImportBinding);

        // Staying within the same module is a rename, so the existing import
        // specifier is edited in place rather than added and removed.
        const isRename =
          missingClassNames.length > 0 &&
          allReferencesToBeReplaced &&
          oldModuleName === newModuleName;

        if (isRename) {
          const referencesInImport = findReferences(
            sourceFile,
            oldClassName,
          ).filter((reference) => reference.getEnd() <= endOfImports);
          if (referencesInImport.length !== 1) {
            throw new Error(
              `Expected exactly one import for ${oldClassName} from ${oldModuleName}, found ${referencesInImport.length}.`,
            );
          }
          swapReference(
            recorder,
            referencesInImport[0],
            missingImportBindings.join(', '),
          );
        } else {
          if (missingImportBindings.length > 0) {
            addImports[newModuleName] ??= [];
            addImports[newModuleName].push(
              ...missingImportBindings.filter(
                (binding) => !addImports[newModuleName].includes(binding),
              ),
            );
          }

          if (allReferencesToBeReplaced) {
            removeImports[oldModuleName] ??= [];
            removeImports[oldModuleName].push(oldClassName);
          }
        }
      }
    });
  });

  Object.entries(addImports).forEach(([moduleName, classNames]) => {
    const change = insertImport(
      sourceFile,
      filePath,
      classNames.join(', '),
      moduleName,
    );
    if (!(change instanceof InsertChange)) {
      recorder.insertRight(
        endOfImports,
        `${eol}import { ${classNames.join(', ')} } from '${moduleName}';`,
      );
      return;
    }
    shiftLineBreakForInsertedImport(change, eol);

    // `insertRight` rather than `applyToUpdateRecorder`'s `insertLeft`: the
    // import lands at the end of the import block, which is also where a fully
    // removed import declaration ends, and only a right-side insert survives
    // that removal.
    recorder.insertRight(change.pos, change.toAdd);
  });

  Object.entries(removeImports).forEach(([moduleName, classNames]) =>
    removeImport(recorder, sourceFile, {
      classNames,
      moduleName,
    }),
  );
}
