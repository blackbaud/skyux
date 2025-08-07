import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
  RunSchematicTask,
} from '@angular-devkit/schematics/tasks';
import { findNodes } from '@angular/cdk/schematics';
import { parseSourceFile } from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {
  insertAfterLastOccurrence,
  insertImport,
  isImported,
} from '@schematics/angular/utility/ast-utils';
import {
  Change,
  applyToUpdateRecorder,
} from '@schematics/angular/utility/change';
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

const AG_GRID_VERSION = '^33.3.2';

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
 * Anywhere SkyAgGridModule is imported, add `ModuleRegistry.registerModules([AllCommunityModule]);`
 * to maintain functionality in AG Grid 33.
 */
function addAgGridModuleRegistry(tree: Tree, path: string): void {
  const content = tree.readText(path);
  if (
    content.includes('SkyAgGridModule') &&
    !content.includes('ModuleRegistry')
  ) {
    const sourceFile = parseSourceFile(tree, path);
    const changes: Change[] = [];

    if (
      isImported(sourceFile, 'SkyAgGridModule', AG_GRID_SKY) &&
      !isImported(sourceFile, 'ModuleRegistry', AG_GRID) &&
      !isImported(sourceFile, 'AllCommunityModule', AG_GRID)
    ) {
      changes.push(
        insertImport(
          sourceFile,
          path,
          'AllCommunityModule, ModuleRegistry',
          AG_GRID,
        ),
      );

      changes.push(
        insertAfterLastOccurrence(
          findNodes(sourceFile, ts.SyntaxKind.ImportDeclaration),
          `\n\n// Added during the SKY UX 12 migration. For details and additional options, see https://www.ag-grid.com/angular-data-grid/modules/\n` +
            `ModuleRegistry.registerModules([AllCommunityModule]);`,
          path,
          0,
        ),
      );

      const recorder = tree.beginUpdate(path);
      applyToUpdateRecorder(recorder, changes);
      tree.commitUpdate(recorder);
    }
  }
}

/**
 * Update grid API calls to match AG Grid 33 changes.
 */
function swapGridApiCalls(tree: Tree, path: string): void {
  const content = tree.readText(path);
  const recorder = tree.beginUpdate(path);
  let instances: RegExpStringIterator<RegExpExecArray>;
  if (content.includes('this.gridApi')) {
    instances = content.matchAll(/\bthis\.gridOptions[?]?\.api\b/g);
    for (const instance of instances) {
      recorder.remove(instance.index, instance[0].length);
      recorder.insertRight(instance.index, 'this.gridApi');
    }
  }
  instances = content.matchAll(/(?<=api[?]?)\.getLastDisplayedRow\(\)/gi);
  for (const instance of instances) {
    recorder.remove(instance.index, instance[0].length);
    recorder.insertRight(instance.index, `.getLastDisplayedRowIndex()`);
  }
  instances = content.matchAll(/(?<=api[?]?\.setColumn)Visible\(([^,]+),/gi);
  for (const instance of instances) {
    recorder.remove(instance.index, instance[0].length);
    recorder.insertRight(instance.index, `sVisible([${instance[1]}],`);
  }
  instances = content.matchAll(/(?<=\bsuppress)Menu(?=:)/gi);
  for (const instance of instances) {
    recorder.remove(instance.index, instance[0].length);
    recorder.insertRight(instance.index, `HeaderMenuButton`);
  }
  instances = content.matchAll(
    /(?<=options = {[^}]+)enableCellChangeFlash(?=:)/gi,
  );
  for (const instance of instances) {
    recorder.insertLeft(
      instance.index,
      `// todo: move enableCellChangeFlash to defaultColumnDef (added by SKY UX 12 migration)\n      // `,
    );
  }
  tree.commitUpdate(recorder);
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

  function warnOnce(message: string): void {
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
          Beginning with AG Grid 33, ESM modules are now included in their packages.
          https://ag-grid.com/angular-data-grid/modules/\n\n`,
        );
      }

      addAgGridModuleRegistry(tree, filePath);
      swapGridApiCalls(tree, filePath);
    });
  });
}

/**
 * Upgrade to AG Grid 33 and address breaking changes:
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
