import { JsonValue, Path } from '@angular-devkit/core';
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
      const build = project.targets.get('build');
      if (build) {
        build.options ??= {} as Record<string, JsonValue | undefined>;
        build.options['styles'] ??= [] as string[];
        build.options['styles'] = (build.options['styles'] as string[]).filter(
          (cssFile) => !cssFile.startsWith('ag-grid-community/dist/styles/')
        );
        if (
          !build.options['styles'].includes(
            'node_modules/@skyux/ag-grid/css/sky-ag-grid.css'
          )
        ) {
          build.options['styles'].push(
            'node_modules/@skyux/ag-grid/css/sky-ag-grid.css'
          );
        }
        project.targets.set('build', build);
        workspace.projects.set(projectName, project);
      }
    });
    await writeWorkspace(tree, workspace);
  };
}

function renameSelectThisNode(
  filePath: Path,
  content: string,
  changes: Change[]
) {
  let pos = content.indexOf('selectThisNode');
  while (pos > -1) {
    changes.push(
      new ReplaceChange(filePath, pos, 'selectThisNode', 'setSelected')
    );
    pos = content.indexOf('selectThisNode', pos + 1);
  }
}

function switchToRowNodeInterface(
  filePath: Path,
  content: string,
  changes: Change[]
) {
  let pos = content.indexOf(': RowNode');
  if (pos > -1) {
    const source = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );
    if (!isImported(source, 'IRowNode', 'ag-grid-community')) {
      changes.push(
        insertImport(source, content, 'IRowNode', 'ag-grid-community')
      );
    }
    while (pos > -1) {
      // Not accessing a RowNode static property.
      if (content.charAt(pos + 9) !== '.') {
        changes.push(
          new ReplaceChange(filePath, pos, ': RowNode', ': IRowNode')
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
      tree
        .getDir(project.sourceRoot || project.root)
        .visit((filePath: Path) => {
          // If the file is not a TypeScript file, we can skip it.
          if (!filePath.endsWith('.ts')) {
            return;
          }
          const content = tree.readText(filePath);
          const changes: Change[] = [];

          renameSelectThisNode(filePath, content, changes);
          switchToRowNodeInterface(filePath, content, changes);

          const recorder = tree.beginUpdate(filePath);
          applyToUpdateRecorder(recorder, changes);
          tree.commitUpdate(recorder);
        });
    });
  };
}

/**
 * Upgrade to AG Grid 29 and address breaking changes:
 *
 * - Introduce IRowNode in some cases replacing RowNode
 * - Replace `selectThisNode` with `setSelected`
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
