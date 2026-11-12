import { UpdateRecorder } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';

import { removeImport } from './remove-import';

/**
 * True if `array` is the value of an `imports: [...]` property on an object
 * literal passed directly to a decorator (e.g. `@Component({ imports: [...] })`)
 * or as the first argument to `TestBed.configureTestingModule({ imports: [...] })`.
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
  const objectLiteral = property.parent;
  const call = objectLiteral.parent;
  if (!ts.isCallExpression(call)) {
    return false;
  }
  return (
    ts.isDecorator(call.parent) ||
    (call.arguments[0] === objectLiteral &&
      call.expression.getText().trim() === 'TestBed.configureTestingModule')
  );
}

/**
 * Removes every reference to `className` from the `imports: [...]` array of an
 * Angular decorator or a `TestBed.configureTestingModule({ ... })` call,
 * consuming the adjacent comma so the remaining entries stay well-formed, then
 * removes the import of `className` from `moduleName` - but only if nothing
 * else in the file still references it. References outside those arrays
 * (unrelated arrays, a parameter that shadows the import, direct assignments,
 * etc.) are left untouched, and the import is kept if any of those remain.
 *
 * Returns `true` when the import statement was removed, `false` when
 * unhandled references kept it in place.
 */
export function removeClassReference(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  className: string,
  moduleName: string,
): boolean {
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

  return !hasUnhandledReference;
}
