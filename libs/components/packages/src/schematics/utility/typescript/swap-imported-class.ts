import { UpdateRecorder } from '@angular-devkit/schematics';
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
  recorder: UpdateRecorder,
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
      if (referencesFiltered.length > 0) {
        const allReferencesToBeReplaced =
          referencesFiltered.length === referencesInCode.length;
        if (!isImported(sourceFile, newClassName, moduleName)) {
          if (allReferencesToBeReplaced) {
            const referencesInImport = findReferences(
              sourceFile,
              oldClassName,
            ).filter((reference) => reference.getEnd() < endOfImports);
            /* istanbul ignore if */
            if (referencesInImport.length !== 1) {
              throw new Error(
                `Expected exactly one import for ${oldClassName} from ${moduleName}, found ${referencesInImport.length}.`,
              );
            }
            swapReference(recorder, referencesInImport[0], newClassName);
          } else {
            applyToUpdateRecorder(recorder, [
              insertImport(sourceFile, filePath, newClassName, moduleName),
            ]);
          }
        } else {
          if (allReferencesToBeReplaced) {
            removeImports[moduleName] ??= [];
            removeImports[moduleName].push(oldClassName);
          }
        }
      }
    });
  });

  const removeImportEntries = Object.entries(removeImports);
  if (removeImportEntries.length > 0) {
    removeImportEntries.forEach(([moduleName, classNames]) =>
      removeImport(recorder, sourceFile, {
        classNames,
        moduleName,
      }),
    );
  }
}
