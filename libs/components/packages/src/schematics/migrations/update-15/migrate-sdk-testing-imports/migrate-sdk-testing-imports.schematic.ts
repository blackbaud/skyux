import { Rule, Tree } from '@angular-devkit/schematics';
import { removePackageJsonDependency } from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { isPackageUsed } from '../../../utility/dependencies';
import { combineImports } from '../../../utility/typescript/combine-imports';
import { parseSourceFile } from '../../../utility/typescript/ng-ast';
import {
  SwapImportedClassOptions,
  swapImportedClass,
} from '../../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getSourceRoot } from '../../../utility/workspace';

const DEPRECATED_PACKAGE = '@skyux-sdk/testing';
const SUPPORTED_PACKAGE = '@skyux/core/testing';

const SWAP_OPTIONS: SwapImportedClassOptions[] = [
  {
    classNames: {
      SkyAppTestUtility: 'SkyAppTestUtility',
      SkyAppTestUtilityDomEventOptions: 'SkyAppTestUtilityDomEventOptions',
      SkyBy: 'SkyBy',
    },
    moduleName: { old: DEPRECATED_PACKAGE, new: SUPPORTED_PACKAGE },
  },
];

function migrateFile(tree: Tree, filePath: string): void {
  if (!tree.readText(filePath).includes(DEPRECATED_PACKAGE)) {
    return;
  }

  const swapRecorder = tree.beginUpdate(filePath);

  swapImportedClass(
    swapRecorder,
    filePath,
    parseSourceFile(tree, filePath),
    SWAP_OPTIONS,
  );

  tree.commitUpdate(swapRecorder);

  // Runs against the swapped file so the moved imports are merged with any
  // that the file already had.
  const combineRecorder = tree.beginUpdate(filePath);

  combineImports(
    combineRecorder,
    parseSourceFile(tree, filePath),
    SUPPORTED_PACKAGE,
  );

  tree.commitUpdate(combineRecorder);
}

/**
 * Moves `SkyAppTestUtility`, `SkyAppTestUtilityDomEventOptions`, and `SkyBy`
 * imports from the deprecated `@skyux-sdk/testing` package to
 * `@skyux/core/testing`, and drops the deprecated dependency once nothing else
 * in the workspace imports it.
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void> => {
    const workspace = await getWorkspace(tree);

    for (const project of workspace.projects.values()) {
      visitProjectFiles(tree, getSourceRoot(project), (filePath) => {
        if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
          migrateFile(tree, filePath);
        }
      });
    }

    if (!(await isPackageUsed(tree, DEPRECATED_PACKAGE))) {
      removePackageJsonDependency(tree, DEPRECATED_PACKAGE);
    }
  };
}
