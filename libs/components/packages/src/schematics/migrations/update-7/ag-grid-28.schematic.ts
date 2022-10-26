import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { getWorkspace } from '../../utility/workspace';

export const UPDATE_TO_VERSION = '28.2.0';

const ANY_MODULE = '@ag-grid-community/';
const ENT_MODULE = '@ag-grid-enterprise/';
const AG_GRID = 'ag-grid-community';
const AG_GRID_ENT = 'ag-grid-enterprise';
const withComponents = 'AgGridModule.withComponents';

/**
 * Upgrade to AG Grid 28 and address three breaking changes:
 *
 * - No longer support `@ag-grid-community/all-modules` -- just use the package
 * - Remove `AgGridModule.withComponents` in module import
 * - Column API renamed getSecondaryColumns / setSecondaryColumns
 *
 * Also advise against mixing modules and packages.
 */
export default function (): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const warned: string[] = [];

    function warnOnce(message: string) {
      if (!warned.includes(message)) {
        warned.push(message);
        context.logger.warn(message);
      }
    }

    const agGridAllModules = getPackageJsonDependency(
      tree,
      `${ANY_MODULE}all-modules`
    );
    const agGridDependency = getPackageJsonDependency(tree, AG_GRID);
    const agGridAllModulesEnt = getPackageJsonDependency(
      tree,
      `${ENT_MODULE}all-modules`
    );
    const agGridDependencyEnt = getPackageJsonDependency(tree, AG_GRID_ENT);
    let type = NodeDependencyType.Default;
    const overwrite = true;
    const version = UPDATE_TO_VERSION;
    if (!agGridAllModules && !agGridDependency) {
      // AG Grid is not installed, so we don't need to do anything.
      return;
    }

    // Determine if there are any community packages that need to be updated.
    if (!agGridDependency && agGridAllModules) {
      type = agGridAllModules.type;
      [AG_GRID, 'ag-grid-angular'].forEach((name) => {
        addPackageJsonDependency(tree, { name, overwrite, type, version });
      });
    }
    if (agGridAllModules) {
      removePackageJsonDependency(tree, `${ANY_MODULE}all-modules`);
      removePackageJsonDependency(tree, `${ANY_MODULE}angular`);
    }

    // Determine if there are any enterprise packages that need to be updated.
    if (!agGridDependencyEnt && agGridAllModulesEnt) {
      type = agGridAllModulesEnt.type;
      addPackageJsonDependency(tree, {
        name: AG_GRID_ENT,
        overwrite,
        type,
        version,
      });
    }
    if (agGridAllModulesEnt) {
      removePackageJsonDependency(tree, `${ENT_MODULE}all-modules`);
    }

    // Install the new packages.
    if (agGridAllModules || agGridAllModulesEnt) {
      context.addTask(new NodePackageInstallTask());
    }

    let sourceRoots = ['src', 'projects'];
    const { workspace } = await getWorkspace(tree);
    if (workspace) {
      sourceRoots = Array.from(workspace.projects.values()).map(
        (p) => p.sourceRoot || p.root
      );
    }
    sourceRoots.forEach((sourceRoot) => {
      tree.getDir(sourceRoot).visit((filePath) => {
        // If the file is not a TypeScript file, we can skip it.
        if (!filePath.endsWith('.ts')) {
          return;
        }
        const content = tree.readText(filePath);
        let updatedContent = content;

        // Prompt the user to moderate the use of AG Grid modules
        if (
          updatedContent.includes(ANY_MODULE) ||
          updatedContent.includes(ENT_MODULE)
        ) {
          warnOnce(
            `\n
          AG Grid recommends not mixing module and package imports.
          https://ag-grid.com/angular-data-grid/modules/\n\n`
          );
        }

        // Replace `@ag-grid-community/all-modules` with `ag-grid-community`
        if (
          agGridAllModules &&
          updatedContent.includes(`${ANY_MODULE}all-modules`)
        ) {
          updatedContent = updatedContent.replace(
            /@ag-grid-community\/all-modules/g,
            AG_GRID
          );
        }

        // Replace `@ag-grid-enterprise/all-modules` with `ag-grid-enterprise`
        if (
          agGridAllModulesEnt &&
          updatedContent.includes(`${ENT_MODULE}all-modules`)
        ) {
          updatedContent = updatedContent.replace(
            /@ag-grid-enterprise\/all-modules/g,
            AG_GRID_ENT
          );
        }

        // Replace `@ag-grid-community/angular` with `ag-grid-angular`
        if (
          agGridAllModules &&
          updatedContent.includes(`${ANY_MODULE}angular`)
        ) {
          updatedContent = updatedContent.replace(
            /@ag-grid-community\/angular/g,
            'ag-grid-angular'
          );
        }

        // Remove `AgGridModule.withComponents` in module import
        if (
          (filePath.endsWith('module.ts') || filePath.endsWith('spec.ts')) &&
          updatedContent.includes(withComponents)
        ) {
          let pos: number;
          while ((pos = updatedContent.indexOf(withComponents)) !== -1) {
            // Find closing parenthesis after `AgGridModule.withComponents`
            const end = updatedContent.indexOf(')', pos);
            // Leave `AgGridModule`, drop `.withComponents`.
            updatedContent = [
              updatedContent.substring(0, pos + 12),
              updatedContent.substring(end + 1),
            ].join('');
          }
        }

        // Column API renamed getSecondaryColumns / setSecondaryColumns
        if (updatedContent.includes('etSecondaryColumns(')) {
          updatedContent = updatedContent.replace(
            /\.(get|set)SecondaryColumns\(/g,
            (_, x) => `.${x}PivotResultColumns(`
          );
        }

        if (updatedContent !== content) {
          tree.overwrite(filePath, updatedContent);
        }
      });
    });
  };
}
