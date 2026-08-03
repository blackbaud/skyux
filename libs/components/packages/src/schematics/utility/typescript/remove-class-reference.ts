import { UpdateRecorder } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';

import { removeImport } from './remove-import';

/**
 * True if `array` is the value of an `imports: [...]` property on an object
 * literal passed directly to a decorator (e.g. `@Component({ imports: [...] })`).
 * A `PropertyAssignment`'s parent is always an `ObjectLiteralExpression` by
 * grammar, so that link doesn't need its own check.
 */
function isDecoratorImportsArray(array: ts.ArrayLiteralExpression): boolean {
  const property = array.parent;
  if (
    !ts.isPropertyAssignment(property) ||
    property.name.getText() !== 'imports'
  ) {
    return false;
  }
  const call = property.parent.parent;
  return ts.isCallExpression(call) && ts.isDecorator(call.parent);
}

/**
 * Removes every reference to `className` from an Angular decorator's
 * `imports: [...]` array, consuming the adjacent comma so the remaining
 * entries stay well-formed, then removes the import of `className` from
 * `moduleName` - but only if nothing else in the file still references it.
 * References outside a decorator's `imports` array (unrelated arrays, a
 * parameter that shadows the import, direct assignments, etc.) are left
 * untouched, and the import is kept if any of those remain.
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

  const decoratorArrayReferences = references.filter(
    (
      reference,
    ): reference is ts.Identifier & { parent: ts.ArrayLiteralExpression } =>
      ts.isArrayLiteralExpression(reference.parent) &&
      isDecoratorImportsArray(reference.parent),
  );
  const hasUnhandledReference =
    decoratorArrayReferences.length !== references.length;

  decoratorArrayReferences.forEach((reference) => {
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

  if (!hasUnhandledReference) {
    removeImport(recorder, sourceFile, {
      classNames: [className],
      moduleName,
    });
  }
}
