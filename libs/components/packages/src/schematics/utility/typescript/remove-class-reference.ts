import { UpdateRecorder } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';

import { removeImport } from './remove-import';

/**
 * Removes every reference to `className` from the array literal it's used in
 * (e.g. an `imports: [...]` decorator array), consuming the adjacent comma so
 * the remaining entries stay well-formed, then removes the now-unused import
 * of `className` from `moduleName`.
 */
export function removeClassReference(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  className: string,
  moduleName: string,
): void {
  const endOfImports = findNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  ).reduce((max, node) => Math.max(max, node.getEnd()), 0);

  const references = findNodes(sourceFile, ts.SyntaxKind.Identifier).filter(
    (node): node is ts.Identifier =>
      ts.isIdentifier(node) &&
      node.text === className &&
      node.getStart() > endOfImports,
  );

  // Non-array references (e.g. a direct assignment or type reference) aren't
  // safe to rewrite here, so leave them - and the import they still need - alone.
  const hasNonArrayReference = references.some(
    (reference) => !ts.isArrayLiteralExpression(reference.parent),
  );

  references
    .filter(
      (
        reference,
      ): reference is ts.Identifier & { parent: ts.ArrayLiteralExpression } =>
        ts.isArrayLiteralExpression(reference.parent),
    )
    .forEach((reference) => {
      const parent = reference.parent;
      const elements = Array.from(parent.elements);
      const index = elements.indexOf(reference as unknown as ts.Expression);

      if (elements.length === 1) {
        recorder.remove(parent.getStart() + 1, parent.getWidth() - 2);
      } else if (index === 0) {
        const start = reference.getStart();
        recorder.remove(start, elements[1].getStart() - start);
      } else {
        const start = elements[index - 1].getEnd();
        recorder.remove(start, reference.getEnd() - start);
      }
    });

  if (!hasNonArrayReference) {
    removeImport(recorder, sourceFile, {
      classNames: [className],
      moduleName,
    });
  }
}
