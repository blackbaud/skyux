import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import ignore from 'ignore';
import { relative } from 'path';
import semver from 'semver';

export const UPDATE_TO_VERSION = '28.2.0';

const UPDATE_LT_VERSION = '28.0.0';
const ANY_MODULE = '@ag-grid-community/';
const ENT_MODULE = '@ag-grid-enterprise/';
const AG_GRID = 'ag-grid-community';
const AG_GRID_ENT = 'ag-grid-enterprise';
const withComponents = 'AgGridModule.withComponents';
const warned: string[] = [];

function warnOnce(message: string) {
  if (!warned.includes(message)) {
    warned.push(message);
    console.warn(message);
  }
}

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
  return (tree: Tree, context: SchematicContext) => {
    let needsPackageUpdated = false;
    let needsEntPackageUpdated = false;
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
    if (
      agGridDependency &&
      semver.lt(agGridDependency.version, UPDATE_LT_VERSION)
    ) {
      type = agGridDependency.type;
      needsPackageUpdated = true;
    } else if (!agGridDependency && agGridAllModules) {
      type = agGridAllModules.type;
      needsPackageUpdated = true;
    }
    if (needsPackageUpdated) {
      [AG_GRID, 'ag-grid-angular'].forEach((name) => {
        addPackageJsonDependency(tree, { name, overwrite, type, version });
      });
    }
    if (agGridAllModules) {
      removePackageJsonDependency(tree, `${ANY_MODULE}all-modules`);
      removePackageJsonDependency(tree, `${ANY_MODULE}angular`);
    }

    // Determine if there are any enterprise packages that need to be updated.
    if (
      agGridDependencyEnt &&
      semver.lt(agGridDependencyEnt.version, UPDATE_LT_VERSION)
    ) {
      type = agGridDependencyEnt.type;
      needsEntPackageUpdated = true;
    } else if (!agGridDependencyEnt && agGridAllModulesEnt) {
      type = agGridAllModulesEnt.type;
      needsEntPackageUpdated = true;
    }
    if (needsEntPackageUpdated) {
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
    if (
      needsPackageUpdated ||
      needsEntPackageUpdated ||
      agGridAllModules ||
      agGridAllModulesEnt
    ) {
      context.addTask(new NodePackageInstallTask());
    }

    const ignoreList = tree.exists('.gitignore')
      ? tree.readText('.gitignore')
      : '';
    const ig = ignore().add(ignoreList);

    tree.visit((filePath) => {
      // If the file is not a TypeScript file or if it is ignored by git, we can skip it.
      if (!filePath.endsWith('.ts') || ig.ignores(relative('/', filePath))) {
        return;
      }
      const content = tree.readText(filePath);
      let updatedContent = content;

      // Prompt the user to moderate the use of AG Grid modules
      if (
        updatedContent.includes(ANY_MODULE) ||
        updatedContent.includes(ENT_MODULE)
      ) {
        warnOnce(`\n
        AG Grid recommends not mixing module and package imports.
        https://ag-grid.com/angular-data-grid/modules/\n\n`);
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
      if (agGridAllModules && updatedContent.includes(`${ANY_MODULE}angular`)) {
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
  };
}
