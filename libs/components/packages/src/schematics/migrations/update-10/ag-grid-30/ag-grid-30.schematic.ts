import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';

import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

const ANY_MODULE = '@ag-grid-community/';
const ENT_MODULE = '@ag-grid-enterprise/';
const AG_GRID = 'ag-grid-community';
const AG_GRID_ENT = 'ag-grid-enterprise';

/**
 * Check package.json for AG Grid dependencies.
 */
function hasAgGridDependency(tree: Tree): boolean {
  const agGridDependency = getPackageJsonDependency(tree, AG_GRID);
  const agGridDependencyEnt = getPackageJsonDependency(tree, AG_GRID_ENT);
  if (agGridDependency || agGridDependencyEnt) {
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
 * Column API renamed getSecondaryColumns / setSecondaryColumns to getSecondaryPivotColumns / setSecondaryPivotColumns.
 */
function renameColumnApiFunctionsInCode(updatedContent: string): string {
  if (
    updatedContent.includes(AG_GRID) &&
    updatedContent.includes('etSecondaryColumns(')
  ) {
    updatedContent = updatedContent.replace(
      /(?<=columnApi\s*)\.(get|set)SecondaryColumns\(/g,
      (_, x) => `.${x}PivotResultColumns(`,
    );
  }
  return updatedContent;
}

/**
 * Grid option renamed suppressCellSelection to suppressCellFocus.
 */
function renameSuppressCellSelectionGridOptionInCode(
  updatedContent: string,
): string {
  if (
    updatedContent.includes(AG_GRID) &&
    updatedContent.match(/gridOptions/i) &&
    updatedContent.includes('suppressCellSelection')
  ) {
    updatedContent = updatedContent.replace(
      /\bsuppressCellSelection\b/g,
      'suppressCellFocus',
    );
  }
  return updatedContent;
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
          https://ag-grid.com/angular-data-grid/modules/\n\n`,
        );
      }

      updatedContent = renameColumnApiFunctionsInCode(updatedContent);
      updatedContent =
        renameSuppressCellSelectionGridOptionInCode(updatedContent);

      if (updatedContent !== content) {
        tree.overwrite(filePath, updatedContent);
      }
    });
  });
}

/**
 * Upgrade to AG Grid 30 and address three breaking changes:
 *
 * - Warn about mixing modules and packages
 * - Column API renamed getSecondaryColumns / setSecondaryColumns
 * - Grid option renamed suppressCellSelection
 *
 * Also advise against mixing modules and packages.
 */
export default function (): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const hasAgGrid = hasAgGridDependency(tree);

    // AG Grid is not installed, so we don't need to do anything.
    if (!hasAgGrid) {
      return;
    }

    await updateSourceFiles(tree, context);
  };
}
