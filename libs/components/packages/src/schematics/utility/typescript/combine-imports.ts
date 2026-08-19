import { UpdateRecorder } from '@angular-devkit/schematics';
import ts from 'typescript';

import {
  NamedImportDeclaration,
  getNamedImportDeclarations,
  getSpecifierText,
  removeStatement,
} from './imports';

function getCombinedSpecifiers(
  declarations: NamedImportDeclaration[],
  isTypeOnly: boolean,
): string[] {
  const seen = new Map<string, { index: number; isTypeOnly: boolean }>();
  const combined: string[] = [];

  for (const declaration of declarations) {
    for (const specifier of declaration.specifiers) {
      const specifierIsTypeOnly =
        declaration.importClause.isTypeOnly || specifier.isTypeOnly;

      const text = getSpecifierText(
        specifier,
        !isTypeOnly && declaration.importClause.isTypeOnly,
      );

      const existing = seen.get(specifier.name.text);

      if (!existing) {
        seen.set(specifier.name.text, {
          index: combined.length,
          isTypeOnly: specifierIsTypeOnly,
        });
        combined.push(text);
      } else if (existing.isTypeOnly && !specifierIsTypeOnly) {
        // A value import of the same name wins, otherwise merging would leave
        // the name usable only as a type.
        combined[existing.index] = text;
        existing.isTypeOnly = false;
      }
    }
  }

  return combined;
}

/**
 * Merges every named import of `moduleName` into the first such declaration,
 * dropping specifiers that are imported more than once.
 */
export function combineImports(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  moduleName: string,
): void {
  // Declarations with a default binding are left alone; the merged clause only
  // carries named specifiers, so folding one in would drop its default.
  const declarations = getNamedImportDeclarations(
    sourceFile,
    moduleName,
  ).filter(({ importClause }) => !importClause.name);

  if (declarations.length < 2) {
    return;
  }

  const [first, ...rest] = declarations;

  // The merged declaration can only stay `import type` if every source was.
  const isTypeOnly = declarations.every(
    ({ importClause }) => importClause.isTypeOnly,
  );

  const specifiers = getCombinedSpecifiers(declarations, isTypeOnly);
  const start = first.importClause.getStart(sourceFile);

  recorder.remove(start, first.importClause.getEnd() - start);
  recorder.insertRight(
    start,
    `${isTypeOnly ? 'type ' : ''}{ ${specifiers.join(', ')} }`,
  );

  for (const { declaration } of rest) {
    removeStatement(recorder, sourceFile, declaration);
  }
}
