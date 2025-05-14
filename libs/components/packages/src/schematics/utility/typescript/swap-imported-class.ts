import { Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { isImported } from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';

import { removeImport } from './remove-import';

export interface SwapImportedClassOptions {
  classNames: Record<string, string>;
  moduleName: string;
  filter?: (node: ts.Identifier) => boolean;
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

function swapReference(
  recorder: UpdateRecorder,
  reference: ts.Identifier,
  newClassName: string,
): void {
  const start = reference.getStart();
  recorder.remove(start, reference.getWidth());
  recorder.insertRight(start, newClassName);
}

export function swapImportedClass(
  tree: Tree,
  filePath: string,
  sourceFile: ts.SourceFile,
  options: SwapImportedClassOptions[],
): void {
  const applicableOptions = options.filter((option) =>
    Object.keys(option.classNames).some((className) =>
      isImported(sourceFile, className, option.moduleName),
    ),
  );
  if (applicableOptions.length === 0) {
    return;
  }

  const endOfImports = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).reduce((max, node) => Math.max(max, node.getEnd()), 0);

  const recorder = tree.beginUpdate(filePath);
  const addImports: Record<string, string[]> = {};
  const removeImports: Record<string, string[]> = {};
  applicableOptions.forEach(({ classNames, moduleName, filter }) => {
    Object.entries(classNames).forEach(([oldClassName, newClassName]) => {
      const referencesInCode = findReferences(sourceFile, oldClassName).filter(
        (reference) => reference.getStart() > endOfImports,
      );
      const referencesFiltered = referencesInCode.filter(
        filter ?? ((): boolean => true),
      );
      referencesFiltered.forEach((reference) => {
        swapReference(recorder, reference, newClassName);
      });
      if (
        referencesFiltered.length > 0 &&
        !isImported(sourceFile, newClassName, moduleName)
      ) {
        addImports[moduleName] ??= [];
        addImports[moduleName].push(newClassName);
      }
      if (referencesFiltered.length === referencesInCode.length) {
        removeImports[moduleName] ??= [];
        removeImports[moduleName].push(oldClassName);
      }
    });
  });

  const changes = Object.entries(addImports).flatMap(
    ([moduleName, classNames]) =>
      classNames.map((className) =>
        insertImport(sourceFile, filePath, className, moduleName),
      ),
  );
  applyToUpdateRecorder(recorder, changes);

  tree.commitUpdate(recorder);

  const removeImportEntries = Object.entries(removeImports);
  if (removeImportEntries.length > 0) {
    const sourceFileAfterChanges = ts.createSourceFile(
      filePath,
      tree.readText(filePath),
      ts.ScriptTarget.Latest,
      true,
    );
    removeImportEntries.forEach(([moduleName, classNames]) =>
      removeImport(tree, filePath, sourceFileAfterChanges, {
        classNames,
        moduleName,
      }),
    );
  }
}
