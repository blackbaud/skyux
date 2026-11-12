import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';

import { swapPackageDependency } from '../../utility/dependencies';
import { logOnce } from '../../utility/log-once';
import { hasUnconvertibleUsage } from '../../utility/typescript/has-unconvertible-usage';
import { parseSourceFile } from '../../utility/typescript/ng-ast';
import { swapModuleForStandalone } from '../../utility/typescript/swap-module-for-standalone';
import { visitProjectFiles } from '../../utility/visit-project-files';

const STACHE_PACKAGE = '@blackbaud/skyux-lib-code-block';
const STACHE_CLASS_NAME = 'SkyCodeModule';
const SKYUX_PACKAGE = '@skyux/code';
const SKYUX_CLASS_NAME = 'SkyCode';

/**
 * Returns `true` when the file's `SkyCodeModule` from Stache was converted.
 */
function convertTypescriptFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
): boolean {
  if (!tree.readText(filePath).includes(STACHE_CLASS_NAME)) {
    return false;
  }

  // Converting the rest of such a file could leave a component with both
  // Stache's `sky-code` and `SkyCode` (NG0300).
  if (
    hasUnconvertibleUsage(parseSourceFile(tree, filePath), STACHE_PACKAGE, [
      STACHE_CLASS_NAME,
    ])
  ) {
    logOnce(
      context,
      'warn',
      `"${filePath}" uses "${STACHE_CLASS_NAME}" from "${STACHE_PACKAGE}" through an alias, a namespace import or a re-export, which this schematic does not convert. Replace it with "${SKYUX_CLASS_NAME}" from "${SKYUX_PACKAGE}" manually.`,
    );
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
