import { chain, Rule, Tree } from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
  RunSchematicTask,
} from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
  NodeDependencyType,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { VERSION as SKYUX_VERSION } from '../../../version';
import { isPackageUsed } from '../../utility/dependencies';
import { combineImports } from '../../utility/typescript/combine-imports';
import { parseSourceFile } from '../../utility/typescript/ng-ast';
import { removeImport } from '../../utility/typescript/remove-import';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';
import { getSourceRoot } from '../../utility/workspace';

const DEPRECATED_PACKAGE = '@skyux-sdk/testing';
const SUPPORTED_PACKAGE = '@skyux-sdk/vitest';

/**
 * This schematic uninstalls our @skyux-sdk/testing jasmine matchers library and
 * replaces it with the @skyux-sdk/vitest matchers library. This schematic assumes
 * the `migrate-sdk-testing-imports` migration ran during the v15 update.
 */
export default function migrateKarmaToVitest(): Rule {
  return (tree, context) => {
    if (!getPackageJsonDependency(tree, DEPRECATED_PACKAGE)) {
      context.logger.warn(
        `Dependency '${DEPRECATED_PACKAGE}' not installed. Skipping migration.`,
      );

      return;
    }

    if (getPackageJsonDependency(tree, SUPPORTED_PACKAGE)) {
      context.logger.warn(
        `Dependency '${SUPPORTED_PACKAGE}' already installed. Skipping migration.`,
      );

      return;
    }

    return chain([
      migrateSdkTestingImports(),
      removeSdkTestingMatcherImports(),
      uninstallSdkTesting(),
      installSdkVitest(),
    ]);
  };
}

async function visitFilesImportingSdkTesting(
  tree: Tree,
  callback: (filePath: string) => void,
): Promise<void> {
  const workspace = await getWorkspace(tree);

  for (const project of workspace.projects.values()) {
    visitProjectFiles(tree, getSourceRoot(project), (filePath) => {
      if (
        filePath.endsWith('.ts') &&
        !filePath.endsWith('.d.ts') &&
        tree.readText(filePath).includes(DEPRECATED_PACKAGE)
      ) {
        callback(filePath);
      }
    });
  }
}

function migrateSdkTestingImports(): Rule {
  return (tree): Promise<void> => {
    return visitFilesImportingSdkTesting(tree, (filePath) => {
      const swapRecorder = tree.beginUpdate(filePath);

      swapImportedClass(
        swapRecorder,
        filePath,
        parseSourceFile(tree, filePath),
        [
          {
            classNames: {
              SkyA11yAnalyzerConfig: 'SkyToBeAccessibleOptions',
              SkyToBeVisibleOptions: 'SkyToBeVisibleOptions',
            },
            moduleName: {
              old: DEPRECATED_PACKAGE,
              new: SUPPORTED_PACKAGE,
            },
          },
        ],
      );

      tree.commitUpdate(swapRecorder);

      const combineRecorder = tree.beginUpdate(filePath);

      combineImports(
        combineRecorder,
        parseSourceFile(tree, filePath),
        SUPPORTED_PACKAGE,
      );

      tree.commitUpdate(combineRecorder);
    });
  };
}

function uninstallSdkTesting(): Rule {
  return async (tree, context) => {
    if (await isPackageUsed(tree, DEPRECATED_PACKAGE)) {
      context.logger.warn(
        `Dependency '${DEPRECATED_PACKAGE}' is still imported by the workspace and was not uninstalled.`,
      );

      return;
    }

    removePackageJsonDependency(tree, DEPRECATED_PACKAGE);
  };
}

function installSdkVitest(): Rule {
  return (tree, context) => {
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Dev,
      name: SUPPORTED_PACKAGE,
      version: `^${SKYUX_VERSION.full}`,
      overwrite: true,
    });

    // The package's `ng-add` can only run after the install task puts its
    // collection on disk.
    const installTaskId = context.addTask(new NodePackageInstallTask());

    context.addTask(new RunSchematicTask(SUPPORTED_PACKAGE, 'ng-add', {}), [
      installTaskId,
    ]);
  };
}

function removeSdkTestingMatcherImports(): Rule {
  return (tree): Promise<void> => {
    return visitFilesImportingSdkTesting(tree, (filePath) => {
      const recorder = tree.beginUpdate(filePath);

      removeImport(recorder, parseSourceFile(tree, filePath), {
        classNames: ['expect', 'expectAsync'],
        moduleName: DEPRECATED_PACKAGE,
      });

      tree.commitUpdate(recorder);
    });
  };
}
