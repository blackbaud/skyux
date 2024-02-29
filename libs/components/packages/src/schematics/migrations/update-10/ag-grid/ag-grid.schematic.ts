import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
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

const AG_GRID_VERSION = '^30.0.0';

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
 * Column API renamed getSecondaryColumns / setSecondaryColumns to getSecondaryPivotColumns / setSecondaryPivotColumns.
 */
function renameColumnApiFunctionsInCode(updatedContent: string): string {
  if (updatedContent.includes('etSecondaryColumns(')) {
    updatedContent = updatedContent.replace(
      /(?<=columnApi\s*)\.(get|set)SecondaryColumns\(/g,
      (_, x) => `.${x}PivotResultColumns(`,
    );
  }
  return updatedContent;
}

/**
 * Update renamed grid options in code.
 */
function renameGridOptionsInCode(updatedContent: string): string {
  if (
    updatedContent.match(/gridOptions/i) &&
    (updatedContent.includes('suppressCellSelection') ||
      updatedContent.includes('getRowNodeId') ||
      updatedContent.includes('enterMovesDown'))
  ) {
    updatedContent = updatedContent
      .replace(/\bsuppressCellSelection\b/g, 'suppressCellFocus')
      .replace(/\bgetRowNodeId\b/g, 'getRowId')
      .replace(/\benterMovesDown(?=\b|AfterEdit)/g, 'enterNavigatesVertically');
  }
  return updatedContent;
}

/**
 * Switch charPress to eventKey.
 */
function renameCharPress(updatedContent: string): string {
  if (updatedContent.match(/\bcharPress\b(?!: undefined)/)) {
    updatedContent = updatedContent.replace(
      /\bcharPress\b(?!: undefined)/g,
      'eventKey',
    );
  }
  return updatedContent;
}

/**
 * Switch cellRendererFramework to cellRenderer.
 */
function renameCellRendererFramework(updatedContent: string): string {
  if (updatedContent.includes('cellRendererFramework')) {
    updatedContent = updatedContent.replace(
      /\bcellRendererFramework\b/g,
      'cellRenderer',
    );
  }
  return updatedContent;
}

/**
 * Check if the file includes any AG Grid imports.
 */
function includesAgGrid(updatedContent: string): boolean {
  return (
    updatedContent.includes(AG_GRID) ||
    updatedContent.includes(AG_GRID_ENT) ||
    updatedContent.includes(AG_GRID_SKY) ||
    updatedContent.includes(ANY_MODULE) ||
    updatedContent.includes(ENT_MODULE)
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
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      // If the file is not a TypeScript file, we can skip it.
      if (!filePath.endsWith('.ts')) {
        return;
      }
      const content = tree.readText(filePath);
      if (!content || !includesAgGrid(content)) {
        return;
      }
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

      updatedContent = renameCellRendererFramework(updatedContent);
      updatedContent = renameCharPress(updatedContent);
      updatedContent = renameColumnApiFunctionsInCode(updatedContent);
      updatedContent = renameGridOptionsInCode(updatedContent);

      if (updatedContent !== content) {
        tree.overwrite(filePath, updatedContent);
      }
    });
  });
}

/**
 * Upgrade to AG Grid 30 and address three breaking changes:
 *
 * - Add missing peer dependency
 * - Warn about mixing modules and packages
 * - Column API renamed getSecondaryColumns / setSecondaryColumns
 * - Grid option renamed suppressCellSelection and getRowNodeId
 * - Rename charPress to eventKey
 * - Rename cellRendererFramework to cellRenderer
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
  };
}
