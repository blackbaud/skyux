import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
  RunSchematicTask,
} from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

const ANY_MODULE = '@ag-grid-community/';
const ENT_MODULE = '@ag-grid-enterprise/';
const AG_GRID = 'ag-grid-community';
const AG_GRID_ENT = 'ag-grid-enterprise';
const AG_GRID_NG = 'ag-grid-angular';
const AG_GRID_SKY = '@skyux/ag-grid';

const AG_GRID_VERSION = '^32.3.3';

/**
 * Check package.json for AG Grid dependencies.
 */
function checkAgGridDependency(tree: Tree, context: SchematicContext): boolean {
  const agGridDependency = getPackageJsonDependency(tree, AG_GRID);
  const agGridDependencyEnt = getPackageJsonDependency(tree, AG_GRID_ENT);
  const agGridDependencyNg = getPackageJsonDependency(tree, AG_GRID_NG);
  if (agGridDependency || agGridDependencyEnt || agGridDependencyNg) {
    if (!agGridDependency) {
      // Missing peer dependency.
      addPackageJsonDependency(tree, {
        name: AG_GRID,
        type: NodeDependencyType.Default,
        version: AG_GRID_VERSION,
      });
      context.addTask(new NodePackageInstallTask());
    }
    return true;
  }

  const packageJson = tree.readJson('package.json') as Record<
    string,
    Record<string, string>
  >;

  return ['dependencies', 'devDependencies'].some((dep) =>
    Object.keys((packageJson && packageJson[dep]) || {}).some(
      (dep) => dep.startsWith(ANY_MODULE) || dep.startsWith(ENT_MODULE),
    ),
  );
}

/**
 * Check if the file includes any AG Grid imports.
 */
function includesAgGrid(updatedContent: string): boolean {
  return (
    updatedContent.includes(AG_GRID) ||
    updatedContent.includes(AG_GRID_ENT) ||
    updatedContent.includes(AG_GRID_SKY)
  );
}

/**
 * Visit all files and apply the changes.
 */
async function updateSourceFiles(
  tree: Tree,
  context: SchematicContext,
): Promise<void> {
  const warned: string[] = [];

  function warnOnce(message: string) {
    if (!warned.includes(message)) {
      warned.push(message);
      context.logger.warn(message);
    }
  }

  const { workspace } = await getWorkspace(tree);
  workspace.projects.forEach((project) => {
    context.logger.debug(
      `Running SKY UX AG Grid updates within ${project.sourceRoot || project.root}.`,
    );
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      // If the file is not a TypeScript file, we can skip it.
      if (!filePath.endsWith('.ts') || filePath.includes('schematics')) {
        return;
      }
      const content = tree.readText(filePath);
      if (!content || !includesAgGrid(content)) {
        return;
      }

      // Prompt the user to moderate the use of AG Grid modules
      if (content.includes(ANY_MODULE) || content.includes(ENT_MODULE)) {
        warnOnce(
          `\n
          AG Grid recommends not mixing module and package imports.
          https://ag-grid.com/angular-data-grid/modules/\n\n`,
        );
      }
    });
  });
}

/**
 * Upgrade to AG Grid 32 and address breaking changes:
 *
 * Also advise against mixing modules and packages.
 */
export default function (): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const hasAgGrid = checkAgGridDependency(tree, context);

    // AG Grid is not installed, so we don't need to do anything.
    if (!hasAgGrid) {
      context.logger.debug(`AG Grid is not installed.`);
      return;
    }

    await updateSourceFiles(tree, context);
    const { workspace } = await getWorkspace(tree);
    for (const project of workspace.projects.values()) {
      const sourceRoot = project.sourceRoot || `${project.root}/src`;
      context.logger.debug(
        `Scheduling AG Grid code modifications for ${sourceRoot}.`,
      );
      context.addTask(
        new RunSchematicTask('@skyux/packages', 'ag-grid-migrate', {
          sourceRoot,
        }),
      );
    }
  };
}
