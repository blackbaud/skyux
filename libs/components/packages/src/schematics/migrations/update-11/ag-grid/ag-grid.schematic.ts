import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
  RunSchematicTask,
} from '@angular-devkit/schematics/tasks';
import { parseSourceFile } from '@angular/cdk/schematics';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { swapImportedClass } from '../../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

import { eventTypeStrings } from './event-type-strings/event-type-strings';
import { switchToUpdateGridOptions } from './switch-to-update-grid-options/switch-to-update-grid-options';

const ANY_MODULE = '@ag-grid-community/';
const ENT_MODULE = '@ag-grid-enterprise/';
const AG_GRID = 'ag-grid-community';
const AG_GRID_ENT = 'ag-grid-enterprise';
const AG_GRID_NG = 'ag-grid-angular';
const AG_GRID_SKY = '@skyux/ag-grid';

const AG_GRID_VERSION = '^32.0.2';

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
 * If available, switch gridOptions.api and gridOptions.columnApi to gridApi.
 */
function swapGridOptionsApiToGridApi(tree: Tree, path: string): void {
  const content = tree.readText(path);
  if (
    content.includes('this.gridApi') &&
    (content.includes('this.gridOptions.api') ||
      content.includes('this.gridOptions.columnApi'))
  ) {
    const recorder = tree.beginUpdate(path);
    const instances = content.matchAll(
      /\bthis\.gridOptions\.(api|columnApi)\b/g,
    );
    for (const instance of instances) {
      recorder.remove(instance.index, instance[0].length);
      recorder.insertRight(instance.index, 'this.gridApi');
    }
    tree.commitUpdate(recorder);
  }
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

function swapClasses(tree: Tree, filePath: string) {
  const sourceFile = parseSourceFile(tree, filePath);
  swapImportedClass(tree, filePath, sourceFile, [
    {
      classNames: {
        Column: 'AgColumn',
        Beans: 'BeanCollection',
      },
      moduleName: 'ag-grid-community',
    },
  ]);
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

      eventTypeStrings(tree, filePath);
      swapClasses(tree, filePath);
      swapGridOptionsApiToGridApi(tree, filePath);
      switchToUpdateGridOptions(tree, filePath);
    });
  });
}

/**
 * Upgrade to AG Grid 32 and address three breaking changes:
 *
 * - Switch Event Types to Strings
 * - Switch gridOptions.api and gridOptions.columnApi to gridApi
 * - Switch setQuickFilter to updateGridOptions
 * - Switch Beans references to use BeanCollection
 * - Switch Column references to use AgColumn
 *
 * Also advise against mixing modules and packages.
 */
export default function (): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const hasAgGrid = checkAgGridDependency(tree, context);

    // AG Grid is not installed, so we don't need to do anything.
    if (!hasAgGrid) {
      return;
    }

    await updateSourceFiles(tree, context);
    const { workspace } = await getWorkspace(tree);
    for (const project of workspace.projects.values()) {
      context.addTask(
        new RunSchematicTask('@skyux/packages', 'ag-grid-migrate', {
          sourceRoot: project.sourceRoot || `${project.root}/src`,
        }),
      );
    }
  };
}
