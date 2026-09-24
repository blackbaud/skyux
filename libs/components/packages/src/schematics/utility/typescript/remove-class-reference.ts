import { UpdateRecorder } from '@angular-devkit/schematics';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import ts from 'typescript';

import { removeImport } from './remove-import';

/**
 * True if `array` is the value of a property (named in `metadataFields`,
 * e.g. `imports: [...]`) on an object literal passed directly to a
 * decorator (e.g. `@Component({ imports: [...] })`) or as the first argument
 * to `TestBed.configureTestingModule({ imports: [...] })`. A
 * `PropertyAssignment`'s parent is always an `ObjectLiteralExpression` by
 * grammar, so that link doesn't need its own check.
 *
 * `exports` only exists on Angular's `@NgModule` metadata (`@Component`,
 * `@Directive`, `TestBed.configureTestingModule`, etc. have no such field),
 * so an `exports` array is only treated as module metadata when the call is
 * `@NgModule`. This keeps `imports` processing available for any decorator
 * (e.g. standalone `@Component` metadata) or `TestBed.configureTestingModule`
 * call while preventing an unrelated custom decorator's `exports` array from
 * being mistaken for module metadata.
 */
function isDecoratorMetadataArray(
  array: ts.ArrayLiteralExpression,
  metadataFields: readonly string[],
): boolean {
  const property = array.parent;
  if (
    !ts.isPropertyAssignment(property) ||
    !metadataFields.includes(property.name.getText())
  ) {
    return false;
  }
  const objectLiteral = property.parent;
  const call = objectLiteral.parent;
  if (!ts.isCallExpression(call)) {
    return false;
  }

  const isDecoratorCall = ts.isDecorator(call.parent);
  const isTestingModuleCall =
    call.arguments[0] === objectLiteral &&
    call.expression.getText().trim() === 'TestBed.configureTestingModule';
  if (!isDecoratorCall && !isTestingModuleCall) {
    return false;
  }
  if (
    property.name.getText() === 'exports' &&
    !(ts.isIdentifier(call.expression) && call.expression.text === 'NgModule')
  ) {
    return false;
  }
  return true;
}

/**
 * Removes every reference to `className` from the given `metadataFields`
 * arrays (default `['imports']`) of an Angular decorator or a
 * `TestBed.configureTestingModule({ ... })` call, consuming the adjacent
 * comma so the remaining entries stay well-formed, then removes the import
 * of `className` from `moduleName` - but only if nothing else in the file
 * still references it. References outside those arrays (unrelated arrays, a
 * parameter that shadows the import, direct assignments, etc.) are left
 * untouched, and the import is kept if any of those remain.
 *
 * Returns `true` when the import statement was removed, `false` when
 * unhandled references kept it in place.
 */
export function removeClassReference(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  className: string,
  moduleName: string,
  metadataFields: readonly string[] = ['imports'],
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
      isDecoratorMetadataArray(reference.parent, metadataFields),
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
