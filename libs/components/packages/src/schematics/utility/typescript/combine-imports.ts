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
  const seen = new Set<string>();
  const combined: string[] = [];

  for (const declaration of declarations) {
    for (const specifier of declaration.specifiers) {
      if (seen.has(specifier.name.text)) {
        continue;
      }

      seen.add(specifier.name.text);
      combined.push(
        getSpecifierText(
          specifier,
          !isTypeOnly && declaration.importClause.isTypeOnly,
        ),
      );
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
  const declarations = getNamedImportDeclarations(sourceFile, moduleName);

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
