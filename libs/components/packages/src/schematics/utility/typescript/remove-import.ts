import { UpdateRecorder } from '@angular-devkit/schematics';
import ts from 'typescript';

import { getNamedImportDeclarations, removeStatement } from './imports';

export interface RemoveImportOptions {
  classNames: string[];
  moduleName: string;
}

/**
 * Removes specifiers from a named import, consuming the separating comma so the
 * remaining specifiers stay well-formed. Contiguous specifiers are removed as a
 * single range to keep the edits from overlapping.
 */
function removeSpecifiers(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  specifiers: readonly ts.ImportSpecifier[],
  isRemoved: (specifier: ts.ImportSpecifier) => boolean,
): void {
  for (let first = 0; first < specifiers.length; first++) {
    if (!isRemoved(specifiers[first])) {
      continue;
    }

    let last = first;

    while (last + 1 < specifiers.length && isRemoved(specifiers[last + 1])) {
      last++;
    }

    // A run takes the comma that precedes it or, when it starts the list, the
    // comma that follows it. At least one specifier is retained here, so there
    // is always a neighbor on one side.
    const [start, end] =
      first > 0
        ? [specifiers[first - 1].getEnd(), specifiers[last].getEnd()]
        : [
            specifiers[first].getStart(sourceFile),
            specifiers[last + 1].getStart(sourceFile),
          ];

    recorder.remove(start, end - start);
    first = last;
  }
}

export function removeImport(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  options: RemoveImportOptions,
): void {
  for (const { declaration, specifiers } of getNamedImportDeclarations(
    sourceFile,
    options.moduleName,
  )) {
    const isRemoved = (specifier: ts.ImportSpecifier): boolean =>
      options.classNames.includes(specifier.name.text);

    const removedCount = specifiers.filter(isRemoved).length;

    if (removedCount === 0) {
      continue;
    }

    if (removedCount === specifiers.length) {
      removeStatement(recorder, sourceFile, declaration);
    } else {
      removeSpecifiers(recorder, sourceFile, specifiers, isRemoved);
    }
  }
}
