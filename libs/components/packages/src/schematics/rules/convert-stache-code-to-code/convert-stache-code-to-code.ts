import { Rule, Tree, chain } from '@angular-devkit/schematics';
import { ExistingBehavior, addDependency } from '@schematics/angular/utility';
import { removePackageJsonDependency } from '@schematics/angular/utility/dependencies';
import ts from 'typescript';

import { isPackageUsed } from '../../utility/dependencies';
import {
  isImportedFromPackage,
  parseSourceFile,
} from '../../utility/typescript/ng-ast';
import {
  isDecoratorMetadataArray,
  removeClassReference,
} from '../../utility/typescript/remove-class-reference';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

const STACHE_PACKAGE = '@blackbaud/skyux-lib-code-block';
const STACHE_CLASS_NAME = 'SkyCodeModule';
const SKYUX_PACKAGE = '@skyux/code';
const SKYUX_CLASS_NAME = 'SkyCode';

const METADATA_FIELDS = ['imports', 'exports'];

/**
 * True if `reference` sits in a decorator or `TestBed` metadata array that
 * already lists `SkyCode`. Swapping it there would list `SkyCode` twice, so
 * `removeClassReference` removes it instead. Other arrays are swapped, since
 * `removeClassReference` leaves them alone.
 */
function isInMetadataArrayWithSkyCode(reference: ts.Identifier): boolean {
  const array = reference.parent;

  return (
    ts.isArrayLiteralExpression(array) &&
    isDecoratorMetadataArray(array, METADATA_FIELDS) &&
    array.elements.some(
      (element) =>
        ts.isIdentifier(element) && element.text === SKYUX_CLASS_NAME,
    )
  );
}

/**
 * Returns `true` when the file imported `SkyCodeModule` from Stache.
 */
function convertTypescriptFile(tree: Tree, filePath: string): boolean {
  if (!tree.readText(filePath).includes(STACHE_CLASS_NAME)) {
    return false;
  }

  const source = parseSourceFile(tree, filePath);

  if (!isImportedFromPackage(source, STACHE_CLASS_NAME, STACHE_PACKAGE)) {
    return false;
  }

  const swapRecorder = tree.beginUpdate(filePath);
  swapImportedClass(swapRecorder, filePath, source, [
    {
      classNames: { [STACHE_CLASS_NAME]: SKYUX_CLASS_NAME },
      moduleName: { old: STACHE_PACKAGE, new: SKYUX_PACKAGE },
      filter: (reference): boolean => !isInMetadataArrayWithSkyCode(reference),
    },
  ]);
  tree.commitUpdate(swapRecorder);

  const swappedSource = parseSourceFile(tree, filePath);

  if (isImportedFromPackage(swappedSource, STACHE_CLASS_NAME, STACHE_PACKAGE)) {
    const removeRecorder = tree.beginUpdate(filePath);
    removeClassReference(
      removeRecorder,
      swappedSource,
      STACHE_CLASS_NAME,
      STACHE_PACKAGE,
      METADATA_FIELDS,
    );
    tree.commitUpdate(removeRecorder);
  }

  return true;
}

/**
 * Replaces Stache's `SkyCodeModule` with SKY UX's standalone `SkyCode`. Both
 * use the `sky-code` selector, so templates are unchanged.
 */
export function convertStacheCodeToCode(projectPath: string): Rule {
  let anyConverted = false;

  return chain([
    (tree): void => {
      visitProjectFiles(tree, projectPath, (filePath) => {
        if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
          anyConverted = convertTypescriptFile(tree, filePath) || anyConverted;
        }
      });
    },
    async (tree): Promise<Rule | void> => {
      if (!anyConverted) {
        return;
      }

      if (!(await isPackageUsed(tree, STACHE_PACKAGE))) {
        removePackageJsonDependency(tree, STACHE_PACKAGE);
      }

      return addDependency(SKYUX_PACKAGE, '0.0.0-PLACEHOLDER', {
        existing: ExistingBehavior.Skip,
      });
    },
  ]);
}
