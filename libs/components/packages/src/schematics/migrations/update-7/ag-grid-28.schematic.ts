import { Path } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependency,
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { getWorkspace } from '../../utility/workspace';

export const UPDATE_TO_VERSION = '28.2.1';

const ANY_MODULE = '@ag-grid-community/';
const ENT_MODULE = '@ag-grid-enterprise/';
const AG_GRID = 'ag-grid-community';
const AG_GRID_ENT = 'ag-grid-enterprise';
const withComponents = 'AgGridModule.withComponents';
const forRoot = 'AgGridModule.withComponents';

/**
 * Check package.json for AG Grid dependencies.
 */
function readDependencies(tree: Tree) {
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
  return {
    agGridAllModules,
    agGridDependency,
    agGridAllModulesEnt,
    agGridDependencyEnt,
  };
}

/**
 * Remove `@ag-grid-community/all-modules` and `@ag-grid-enterprise/all-modules` from package.json.
 */
function swapModulesWithPackageDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const {
      agGridAllModules,
      agGridDependency,
      agGridAllModulesEnt,
      agGridDependencyEnt,
    } = readDependencies(tree);

    // AG Grid is not installed, so we don't need to do anything.
    if (
      !agGridAllModules &&
      !agGridDependency &&
      !agGridAllModulesEnt &&
      !agGridDependencyEnt
    ) {
      return;
    }

    let type = NodeDependencyType.Default;
    const overwrite = true;
    const version = UPDATE_TO_VERSION;

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
  };
}

/**
 * Replace `@ag-grid-community/all-modules` with `ag-grid-community`/`ag-grid-angular`,
 * and replace `@ag-grid-enterprise/all-modules` with `ag-grid-enterprise`.
 */
function swapModulesWithPackageInCode(
  updatedContent: string,
  agGridAllModules: NodeDependency | null,
  agGridAllModulesEnt: NodeDependency | null
): string {
  // Replace `@ag-grid-community/all-modules` with `ag-grid-community`
  if (agGridAllModules && updatedContent.includes(`${ANY_MODULE}all-modules`)) {
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
  if (agGridAllModules && updatedContent.includes(`${ANY_MODULE}angular`)) {
    updatedContent = updatedContent.replace(
      /@ag-grid-community\/angular/g,
      'ag-grid-angular'
    );
  }
  return updatedContent;
}

/**
 * Remove `AgGridModule.withComponents` and `AgGridModule.forRoot` in module imports.
 */
function removeWithComponentsStaticImportsCall(
  filePath: Path,
  updatedContent: string
): string {
  [withComponents, forRoot].forEach((staticModule) => {
    if (
      (filePath.endsWith('module.ts') || filePath.endsWith('spec.ts')) &&
      updatedContent.includes(staticModule)
    ) {
      let pos: number;
      while ((pos = updatedContent.indexOf(staticModule)) !== -1) {
        // Find closing parenthesis after `AgGridModule.withComponents`
        const end = updatedContent.indexOf(')', pos);
        // Leave `AgGridModule`, drop `.withComponents` and `.forRoot`.
        updatedContent = [
          updatedContent.substring(0, pos + 12),
          updatedContent.substring(end + 1),
        ].join('');
      }
    }
  });
  return updatedContent;
}

/**
 * Column API renamed getSecondaryColumns / setSecondaryColumns to getSecondaryPivotColumns / setSecondaryPivotColumns.
 */
function renameColumnApiFunctionsInCode(updatedContent: string): string {
  if (
    updatedContent.includes(AG_GRID) &&
    updatedContent.includes('etSecondaryColumns(')
  ) {
    updatedContent = updatedContent.replace(
      /(?<=columnApi\s*)\.(get|set)SecondaryColumns\(/g,
      (_, x) => `.${x}PivotResultColumns(`
    );
  }
  return updatedContent;
}

/**
 * Grid option renamed suppressCellSelection to suppressCellFocus.
 */
function renameSuppressCellSelectionGridOptionInCode(
  updatedContent: string
): string {
  if (
    updatedContent.includes(AG_GRID) &&
    updatedContent.match(/gridOptions/i) &&
    updatedContent.includes('suppressCellSelection')
  ) {
    updatedContent = updatedContent.replace(
      /\bsuppressCellSelection\b/g,
      'suppressCellFocus'
    );
  }
  return updatedContent;
}

/**
 * Visit all files and apply the changes.
 */
function updateSourceFiles(): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const warned: string[] = [];

    function warnOnce(message: string) {
      if (!warned.includes(message)) {
        warned.push(message);
        context.logger.warn(message);
      }
    }

    const {
      agGridAllModules,
      agGridDependency,
      agGridAllModulesEnt,
      agGridDependencyEnt,
    } = readDependencies(tree);

    // AG Grid is not installed, so we don't need to do anything.
    if (
      !agGridAllModules &&
      !agGridDependency &&
      !agGridAllModulesEnt &&
      !agGridDependencyEnt
    ) {
      return;
    }

    const { workspace } = await getWorkspace(tree);
    workspace.projects.forEach((project) => {
      tree
        .getDir(project.sourceRoot || project.root)
        .visit((filePath: Path) => {
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

          updatedContent = swapModulesWithPackageInCode(
            updatedContent,
            agGridAllModules,
            agGridAllModulesEnt
          );
          updatedContent = removeWithComponentsStaticImportsCall(
            filePath,
            updatedContent
          );
          updatedContent = renameColumnApiFunctionsInCode(updatedContent);
          updatedContent =
            renameSuppressCellSelectionGridOptionInCode(updatedContent);

          if (updatedContent !== content) {
            tree.overwrite(filePath, updatedContent);
          }
        });
    });
  };
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
  return chain([updateSourceFiles(), swapModulesWithPackageDependencies()]);
}
