import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

describe('ag-grid-29.schematic', () => {
  let tree: Tree;
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../migration-collection.json')
  );

  function setupTest(
    packageJson: { [key: string]: any } = {},
    build: { [key: string]: any } = {}
  ) {
    tree = Tree.empty();
    const angularJson = {
      version: 1,
      projects: {
        test: {
          projectType: 'application',
          root: '',
          architect: {
            build,
          },
        },
      },
    };
    tree.create('/angular.json', JSON.stringify(angularJson));
    tree.create('/package.json', JSON.stringify(packageJson));
  }

  it('should work', async () => {
    expect.assertions(1);
    setupTest(
      {
        dependencies: {
          'ag-grid-community': '0.0.0',
          'ag-grid-angular': '0.0.0',
          'ag-grid-enterprise': '0.0.0',
        },
      },
      {
        options: {
          styles: ['ag-grid-community/dist/styles/ag-theme-alpine.css'],
        },
      }
    );
    const updatedTree = await runner.runSchematic('ag-grid-29', {}, tree);
    const workspace = JSON.parse(updatedTree.readText('/angular.json'));
    expect(workspace.projects.test.architect.build.options.styles).toEqual([
      'node_modules/@skyux/ag-grid/css/sky-ag-grid.css',
    ]);
  });

  it('should noop', async () => {
    expect.assertions(1);
    setupTest({
      dependencies: {
        other: '27.1.1',
      },
    });
    const updatedTree = await runner.runSchematic('ag-grid-29', {}, tree);
    expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
      dependencies: {
        other: '27.1.1',
      },
    });
  });

  it('should update selectThisNode', async () => {
    setupTest({
      dependencies: {
        'ag-grid-community': '0.0.0',
        'ag-grid-angular': '0.0.0',
      },
    });
    tree.create(
      'src/app/app.component.ts',
      `
        export class AppComponent {
          public updateCheckbox(selected: boolean) {
            return this.#row.selectThisNode(selected);
          }
        }`
    );
    tree.create(
      'src/app/no-change.component.ts',
      `export class NoChangeComponent {}`
    );
    const updatedTree = await runner.runSchematic('ag-grid-29', {}, tree);
    expect(updatedTree.readText('src/app/app.component.ts')).toMatchSnapshot();
  });

  it('should update RowNode to use interface', async () => {
    setupTest({
      dependencies: {
        'ag-grid-community': '0.0.0',
        'ag-grid-angular': '0.0.0',
      },
    });
    tree.create(
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
    const updatedTree = await runner.runSchematic('ag-grid-29', {}, tree);
    expect(updatedTree.readText('src/app/app.component.ts')).toMatchSnapshot();
  });
});
