import { Path } from '@angular-devkit/core';
import { Rule, Tree, chain } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { readWorkspace, writeWorkspace } from '@schematics/angular/utility';
import {
  insertImport,
  isImported,
} from '@schematics/angular/utility/ast-utils';
import {
  Change,
  ReplaceChange,
  applyToUpdateRecorder,
} from '@schematics/angular/utility/change';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';

import { visitProjectFiles } from '../../../utility/visit-project-files';

const AG_GRID = 'ag-grid-community';
const AG_GRID_ENT = 'ag-grid-enterprise';

/**
 * Check package.json for AG Grid dependencies.
 */
function readDependencies(tree: Tree) {
  const agGridDependency = getPackageJsonDependency(tree, AG_GRID);
  const agGridDependencyEnt = getPackageJsonDependency(tree, AG_GRID_ENT);
  return {
    agGridDependency,
    agGridDependencyEnt,
  };
}

/**
 * Do not import AG Grid themes in angular.json.
 */
function removeAgGridCssFiles(): Rule {
  return async (tree: Tree): Promise<void> => {
    const workspace = await readWorkspace(tree);
    workspace.projects.forEach((project, projectName) => {
      ['build', 'test'].forEach((targetName) => {
        if (
          targetName === 'build' &&
          project.extensions['projectType'] === 'library'
        ) {
          return;
        }
        const targetDefinition = project.targets.get(targetName);
        if (
          targetDefinition?.['options']?.['styles'] &&
          Array.isArray(targetDefinition.options['styles']) &&
          targetDefinition.options['styles'].includes(
            '@skyux/theme/css/sky.css',
          )
        ) {
          targetDefinition['options']['styles'] = (
            targetDefinition.options['styles'] as string[]
          ).filter(
            (cssFile) => !cssFile.startsWith('ag-grid-community/dist/styles/'),
          );
          if (
            !targetDefinition.options['styles'].includes(
              '@skyux/ag-grid/css/sky-ag-grid.css',
            ) &&
            !targetDefinition.options['styles'].includes(
              'node_modules/@skyux/ag-grid/css/sky-ag-grid.css',
            )
          ) {
            targetDefinition.options['styles'].push(
              '@skyux/ag-grid/css/sky-ag-grid.css',
            );
          }
          project.targets.set(targetName, targetDefinition);
        }
      });
      workspace.projects.set(projectName, project);
    });
    await writeWorkspace(tree, workspace);
  };
}

function switchToRenamedMethods(
  filePath: Path,
  content: string,
  changes: Change[],
) {
  const renames = new Map<string, string>([
    ['selectThisNode', 'setSelected'],
    ['columnApi.setColumnState', 'columnApi.applyColumnState'],
    ['column.isLockVisible()', 'column.getColDef().lockVisible'],
  ]);
  renames.forEach((toText, fromText) => {
    let pos = content.indexOf(fromText);
    while (pos > -1) {
      changes.push(new ReplaceChange(filePath, pos, fromText, toText));
      pos = content.indexOf(fromText, pos + 1);
    }
  });
}

function switchToRowNodeInterface(
  filePath: Path,
  content: string,
  changes: Change[],
) {
  let pos = content.indexOf(': RowNode');
  if (pos > -1) {
    const source = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    if (!isImported(source, 'IRowNode', 'ag-grid-community')) {
      changes.push(
        insertImport(source, content, 'IRowNode', 'ag-grid-community'),
      );
    }
    while (pos > -1) {
      // Not accessing a RowNode static property.
      if (content.charAt(pos + 9) !== '.') {
        changes.push(
          new ReplaceChange(filePath, pos, ': RowNode', ': IRowNode'),
        );
      }
      pos = content.indexOf(': RowNode', pos + 1);
    }
  }
}

/**
 * Visit all files and apply the changes.
 */
function updateSourceFiles(): Rule {
  return async (tree: Tree): Promise<void> => {
    const workspace = await readWorkspace(tree);
    workspace.projects.forEach((project) => {
      visitProjectFiles(
        tree,
        project.sourceRoot || project.root,
        (filePath) => {
          // If the file is not a TypeScript file, we can skip it.
          if (!filePath.endsWith('.ts')) {
            return;
          }
          const content = tree.readText(filePath);
          const changes: Change[] = [];

          switchToRenamedMethods(filePath, content, changes);
          switchToRowNodeInterface(filePath, content, changes);

          const recorder = tree.beginUpdate(filePath);
          applyToUpdateRecorder(recorder, changes);
          tree.commitUpdate(recorder);
        },
      );
    });
  };
}

/**
 * Upgrade to AG Grid 29 and address breaking changes:
 *
 * - Introduce IRowNode in some cases replacing RowNode
 * - Replace `selectThisNode` with `setSelected`
 * - Replace `columnApi.setColumnState` with `columnApi.applyColumnState`
 * - Replace `column.isLockVisible()` with `column.getColDef().lockVisible`
 * - Do not import AG Grid theme CSS files in angular.json
 *
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void | Rule> => {
    const { agGridDependency, agGridDependencyEnt } = readDependencies(tree);

    // AG Grid is not installed, so we don't need to do anything.
    if (!agGridDependency && !agGridDependencyEnt) {
      return;
    }

    return chain([updateSourceFiles(), removeAgGridCssFiles()]);
  };
}
