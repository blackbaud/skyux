import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { JSONFile } from '@schematics/angular/utility/json-file';

import { createTestApp, createTestLibrary } from '../../../testing/scaffold';

describe('ag-grid-29.schematic', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../migration-collection.json')
  );

  async function setupTest(
    packageJson: { dependencies?: any } = {},
    build: { options?: any } = {},
    appOrLib: 'application' | 'library' = 'application'
  ) {
    let tree: Tree;
    if (appOrLib === 'application') {
      tree = await createTestApp(runner, { projectName: 'test' });
    } else {
      tree = await createTestLibrary(runner, { projectName: 'test' });
    }
    if (packageJson['dependencies']) {
      const packageJsonFile = new JSONFile(tree, 'package.json');
      packageJsonFile.modify(['dependencies'], {
        ...(packageJsonFile.get(['dependencies']) || {}),
        ...packageJson['dependencies'],
      });
    }
    if (build['options']) {
      const angularJsonFile = new JSONFile(tree, 'angular.json');
      angularJsonFile.modify(
        ['projects', 'test', 'architect', 'build', 'options'],
        build['options']
      );
    }
    return {
      tree,
    };
  }

  it('should verify css config', async () => {
    expect.assertions(1);
    const { tree } = await setupTest(
      {
        dependencies: {
          'ag-grid-community': '0.0.0',
          'ag-grid-angular': '0.0.0',
          'ag-grid-enterprise': '0.0.0',
        },
      },
      {
        options: {
          styles: [
            'node_modules/@skyux/theme/css/sky.css',
            'ag-grid-community/dist/styles/ag-theme-alpine.css',
          ],
        },
      }
    );
    const updatedTree = await runner.runSchematic('ag-grid-29', {}, tree);
    const workspace = new JSONFile(updatedTree, '/angular.json');
    expect(
      workspace.get([
        'projects',
        'test',
        'architect',
        'build',
        'options',
        'styles',
      ])
    ).toEqual([
      'node_modules/@skyux/theme/css/sky.css',
      'node_modules/@skyux/ag-grid/css/sky-ag-grid.css',
    ]);
  });

  it('should do nothing if AG Grid is not installed', async () => {
    expect.assertions(1);
    const { tree } = await setupTest({
      dependencies: {
        other: '27.1.1',
      },
    });
    const updatedTree = await runner.runSchematic('ag-grid-29', {}, tree);
    const packageJson = new JSONFile(updatedTree, '/package.json');
    expect(packageJson.get(['dependencies', 'other'])).toEqual('27.1.1');
  });

  it('should do nothing on library build configuration', async () => {
    expect.assertions(1);
    const { tree } = await setupTest(
      {
        dependencies: {
          'ag-grid-community': '0.0.0',
          'ag-grid-angular': '0.0.0',
        },
      },
      {},
      'library'
    );
    const angularJson = new JSONFile(tree, '/angular.json');
    const beforeConfig = angularJson.get(['projects', 'test', 'architect']);
    const updatedTree = await runner.runSchematic('ag-grid-29', {}, tree);
    const updatedAngularJson = new JSONFile(updatedTree, '/angular.json');
    expect(updatedAngularJson.get(['projects', 'test', 'architect'])).toEqual(
      beforeConfig
    );
  });

  it('should update selectThisNode', async () => {
    const { tree } = await setupTest({
      dependencies: {
        'ag-grid-community': '0.0.0',
        'ag-grid-angular': '0.0.0',
      },
    });
    tree.overwrite(
      'src/app/app.component.ts',
      `
        export class AppComponent {
          public updateCheckbox(column: Column, selected: boolean) {
            if (!column.isLockVisible()) {
              return this.#row.selectThisNode(selected);
            }
          }
        }`
    );
    tree.create(
      'src/app/no-change.component.ts',
      `export class NoChangeComponent {}`
    );
    const updatedTree = await runner.runSchematic('ag-grid-29', {}, tree);
    expect(updatedTree.readText('src/app/app.component.ts'))
      .toMatchInlineSnapshot(`
      "
              export class AppComponent {
                public updateCheckbox(column: Column, selected: boolean) {
                  if (!column.getColDef().lockVisible) {
                    return this.#row.setSelected(selected);
                  }
                }
              }"
    `);
  });

  it('should update RowNode to use interface', async () => {
    const { tree } = await setupTest({
      dependencies: {
        'ag-grid-community': '0.0.0',
        'ag-grid-angular': '0.0.0',
      },
    });
    tree.overwrite(
      'src/app/app.component.ts',
      `
        import { RowNode } from 'ag-grid-community';

        export class AppComponent {
          public updateRow(row: RowNode) {
            const options = {
              event: RowNode.EVENT_CELL_CHANGED,
            };
            row.addEventListener(RowNode.EVENT_CELL_CHANGED, () => undefined)
          }
        }`
    );
    tree.create(
      'src/app/no-change.component.ts',
      `export class NoChangeComponent {}`
    );

    // The spec says sourceRoot is optional, so testing a case without it.
    const angularJson = new JSONFile(tree, '/angular.json');
    angularJson.remove(['projects', 'test', 'sourceRoot']);

    const updatedTree = await runner.runSchematic('ag-grid-29', {}, tree);
    expect(updatedTree.readText('src/app/app.component.ts'))
      .toMatchInlineSnapshot(`
      "
              import { RowNode, IRowNode } from 'ag-grid-community';

              export class AppComponent {
                public updateRow(row: IRowNode) {
                  const options = {
                    event: RowNode.EVENT_CELL_CHANGED,
                  };
                  row.addEventListener(RowNode.EVENT_CELL_CHANGED, () => undefined)
                }
              }"
    `);
  });
});
