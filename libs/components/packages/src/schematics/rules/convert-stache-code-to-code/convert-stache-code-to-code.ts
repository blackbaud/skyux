import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';

import { swapPackageDependency } from '../../utility/dependencies';
import { logOnce } from '../../utility/log-once';
import { hasUnconvertibleUsage } from '../../utility/typescript/has-unconvertible-usage';
import { isModuleUsedByFile } from '../../utility/typescript/is-module-used-by-file';
import {
  isImportedFromPackage,
  parseSourceFile,
} from '../../utility/typescript/ng-ast';
import { removeClassReference } from '../../utility/typescript/remove-class-reference';
import { swapModuleForStandalone } from '../../utility/typescript/swap-module-for-standalone';
import { visitProjectFiles } from '../../utility/visit-project-files';

const STACHE_PACKAGE = '@blackbaud/skyux-lib-code-block';
const STACHE_CLASS_NAME = 'SkyCodeModule';
const SKYUX_PACKAGE = '@skyux/code';
const SKYUX_CLASS_NAME = 'SkyCode';
const SKYUX_TAG = 'sky-code';

/**
 * Returns `true` when the file's `SkyCodeModule` from Stache was swapped for
 * `SkyCode`. A file whose templates don't render `<sky-code>` has the unused
 * module removed instead, so it doesn't gain an unused `SkyCode` import.
 */
function convertTypescriptFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
): boolean {
  if (!tree.readText(filePath).includes(STACHE_CLASS_NAME)) {
    return false;
  }

  const source = parseSourceFile(tree, filePath);

  // Converting the rest of such a file could leave a component with both
  // Stache's `sky-code` and `SkyCode` (NG0300).
  if (hasUnconvertibleUsage(source, STACHE_PACKAGE, [STACHE_CLASS_NAME])) {
    logOnce(
      context,
      'warn',
      `"${filePath}" uses "${STACHE_CLASS_NAME}" from "${STACHE_PACKAGE}" through an alias, a namespace import or a re-export, which this schematic does not convert. Replace it with "${SKYUX_CLASS_NAME}" from "${SKYUX_PACKAGE}" manually.`,
    );
    return false;
  }

  if (!isImportedFromPackage(source, STACHE_CLASS_NAME, STACHE_PACKAGE)) {
    return false;
  }

  if (!isModuleUsedByFile(tree, filePath, [STACHE_CLASS_NAME], [SKYUX_TAG])) {
    const recorder = tree.beginUpdate(filePath);
    removeClassReference(recorder, source, STACHE_CLASS_NAME, STACHE_PACKAGE);
    tree.commitUpdate(recorder);

    return false;
  }

  return swapModuleForStandalone(
    tree,
    filePath,
    { className: STACHE_CLASS_NAME, packageName: STACHE_PACKAGE },
    { className: SKYUX_CLASS_NAME, packageName: SKYUX_PACKAGE },
  );
}

/**
 * Replaces Stache's `SkyCodeModule` with SKY UX's standalone `SkyCode`. Both
 * use the `sky-code` selector, so templates are unchanged.
 */
export function convertStacheCodeToCode(projectPath: string): Rule {
  let anyConverted = false;

  return chain([
    (tree, context): void => {
      visitProjectFiles(tree, projectPath, (filePath) => {
        if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
          anyConverted =
            convertTypescriptFile(tree, filePath, context) || anyConverted;
        }
      });
    },
    async (tree): Promise<Rule | void> => {
      if (anyConverted) {
        return await swapPackageDependency(
          tree,
          projectPath,
          STACHE_PACKAGE,
          SKYUX_PACKAGE,
        );
      }
    },
  ]);
}
