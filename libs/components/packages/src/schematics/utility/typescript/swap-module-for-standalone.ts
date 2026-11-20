import { Tree } from '@angular-devkit/schematics';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import ts from 'typescript';

import {
  addSymbolToClassMetadata,
  getLocalImportName,
  isImportedFromPackage,
  isSymbolInClassMetadataFieldArray,
  parseSourceFile,
} from './ng-ast';
import {
  isDecoratorMetadataArray,
  removeClassReference,
} from './remove-class-reference';
import { swapImportedClass } from './swap-imported-class';

const METADATA_FIELDS = ['imports', 'exports'];

/**
 * True if `reference` sits in a decorator or `TestBed` metadata array that
 * already lists `localName`. Swapping it there would list the standalone class
 * twice, so `removeClassReference` removes it instead. Other arrays are
 * swapped, since `removeClassReference` leaves them alone.
 */
function isInMetadataArrayWith(
  reference: ts.Identifier,
  localName: string,
): boolean {
  const array = reference.parent;

  return (
    ts.isArrayLiteralExpression(array) &&
    isDecoratorMetadataArray(array, METADATA_FIELDS) &&
    array.elements.some(
      (element) => ts.isIdentifier(element) && element.text === localName,
    )
  );
}

/**
 * An NgModule can export a module without importing it, but Angular only lets
 * it export a standalone component it also imports, so every NgModule in the
 * file that exports `localName` gets it in `imports` too.
 */
export function importExportedStandalone(
  tree: Tree,
  filePath: string,
  localName: string,
): void {
  const changes = addSymbolToClassMetadata(
    parseSourceFile(tree, filePath),
    'NgModule',
    filePath,
    'imports',
    localName,
    null,
    (metadata) =>
      isSymbolInClassMetadataFieldArray(metadata, 'exports', localName),
  );

  if (changes.length > 0) {
    const recorder = tree.beginUpdate(filePath);
    applyToUpdateRecorder(recorder, changes);
    tree.commitUpdate(recorder);
  }
}

/**
 * Replaces a named import of the NgModule `from` with the standalone class
 * `to` everywhere the file references it, reusing an existing (even aliased)
 * import of `to` and never listing it twice in a metadata array. Returns
 * `true` when the file imported `from`.
 */
export function swapModuleForStandalone(
  tree: Tree,
  filePath: string,
  from: { className: string; packageName: string },
  to: { className: string; packageName: string },
): boolean {
  const source = parseSourceFile(tree, filePath);

  if (!isImportedFromPackage(source, from.className, from.packageName)) {
    return false;
  }

  const localName =
    getLocalImportName(source, to.className, to.packageName) ?? to.className;

  const swapRecorder = tree.beginUpdate(filePath);
  swapImportedClass(swapRecorder, filePath, source, [
    {
      classNames: { [from.className]: to.className },
      moduleName: { old: from.packageName, new: to.packageName },
      filter: (reference): boolean =>
        !isInMetadataArrayWith(reference, localName),
      localNames: { [to.className]: localName },
    },
  ]);
  tree.commitUpdate(swapRecorder);

  const swappedSource = parseSourceFile(tree, filePath);

  if (isImportedFromPackage(swappedSource, from.className, from.packageName)) {
    const removeRecorder = tree.beginUpdate(filePath);
    removeClassReference(
      removeRecorder,
      swappedSource,
      from.className,
      from.packageName,
      METADATA_FIELDS,
    );
    tree.commitUpdate(removeRecorder);
  }

  importExportedStandalone(tree, filePath, localName);

  return true;
}
