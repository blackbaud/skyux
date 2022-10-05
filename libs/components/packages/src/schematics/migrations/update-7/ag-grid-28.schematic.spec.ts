import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { UPDATE_TO_VERSION } from './ag-grid-28.schematic';

describe('ag-grid-28.schematic', () => {
  let tree: Tree;

  function setupTest(packageJson: { [key: string]: any } = {}) {
    tree = Tree.empty();
    tree.create('/package.json', JSON.stringify(packageJson));
  }

  it('should work', function () {
    expect.assertions(1);
    setupTest({
      dependencies: {
        'ag-grid-community': '27.1.1',
        'ag-grid-angular': '27.1.1',
        'ag-grid-enterprise': '27.1.1',
      },
    });
    const runner = new SchematicTestRunner(
      'schematics',
      require.resolve('../migration-collection.json')
    );
    runner.runSchematicAsync('ag-grid-28', {}, tree).subscribe((updatedTree) =>
      expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
        dependencies: {
          'ag-grid-community': UPDATE_TO_VERSION,
          'ag-grid-angular': UPDATE_TO_VERSION,
          'ag-grid-enterprise': UPDATE_TO_VERSION,
        },
      })
    );
  });

  it('should noop', function () {
    expect.assertions(1);
    setupTest({
      dependencies: {
        other: '27.1.1',
      },
    });
    const runner = new SchematicTestRunner(
      'schematics',
      require.resolve('../migration-collection.json')
    );
    runner.runSchematicAsync('ag-grid-28', {}, tree).subscribe((updatedTree) =>
      expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
        dependencies: {
          other: '27.1.1',
        },
      })
    );
  });

  it('should swap @ag-grid-community/all-modules', function () {
    expect.assertions(1);
    setupTest({
      devDependencies: {
        '@ag-grid-community/all-modules': '27.1.1',
        '@ag-grid-enterprise/all-modules': '27.1.1',
      },
    });
    const runner = new SchematicTestRunner(
      'schematics',
      require.resolve('../migration-collection.json')
    );
    runner.runSchematicAsync('ag-grid-28', {}, tree).subscribe((updatedTree) =>
      expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
        devDependencies: {
          'ag-grid-community': UPDATE_TO_VERSION,
          'ag-grid-angular': UPDATE_TO_VERSION,
          'ag-grid-enterprise': UPDATE_TO_VERSION,
        },
      })
    );
  });

  it('should remove @ag-grid-community/all-modules', function () {
    expect.assertions(4);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(console.log);
    setupTest({
      dependencies: {
        '@ag-grid-community/all-modules': '27.1.1',
        '@ag-grid-enterprise/all-modules': '27.1.1',
        'ag-grid-community': '27.1.1',
        'ag-grid-angular': '27.1.1',
      },
    });
    tree.create('.gitignore', 'node_modules');
    tree.create(
      'src/app/app.module.ts',
      `
        import { AgGridModule } from '@ag-grid-community/all-modules';
        import { ExampleComponent } from '@ag-grid-community/angular';
        import { AgGridEnterpriseModule } from '@ag-grid-enterprise/all-modules';

        @NgModule({
          imports: [
            BrowserModule,
            AgGridModule.withComponents([
              SomeComponent,
            ]),
            AgGridEnterpriseModule,
          ],
        })
        export class AppModule {}`
    );

    tree.create(
      'src/app/no-change.component.ts',
      `export class NoChangeComponent {}`
    );
    tree.create(
      'node_modules/@ag-grid-community/all-modules/index.d.ts',
      `file content`
    );
    const runner = new SchematicTestRunner(
      'schematics',
      require.resolve('../migration-collection.json')
    );
    runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .subscribe((updatedTree) => {
        expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
          dependencies: {
            'ag-grid-community': UPDATE_TO_VERSION,
            'ag-grid-angular': UPDATE_TO_VERSION,
            'ag-grid-enterprise': UPDATE_TO_VERSION,
          },
        });
        expect(updatedTree.readText('src/app/app.module.ts')).toMatchSnapshot();
        expect(warnSpy).toHaveBeenCalled();
        expect(warnSpy.mock.calls[0][0]).toMatchSnapshot();
      });
  });

  it('should remove @ag-grid-community/all-modules when already on v28', function () {
    expect.assertions(2);
    setupTest({
      dependencies: {
        '@ag-grid-community/all-modules': '27.1.1',
        'ag-grid-community': UPDATE_TO_VERSION,
        'ag-grid-angular': UPDATE_TO_VERSION,
      },
    });
    tree.create(
      'src/app/app.module.ts',
      `
        import { AgGridModule } from '@ag-grid-community/all-modules';

        @NgModule({
          imports: [
            BrowserModule,
            AgGridModule.withComponents([
              SomeComponent,
            ]),
          ],
        })
        export class AppModule {}`
    );
    const runner = new SchematicTestRunner(
      'schematics',
      require.resolve('../migration-collection.json')
    );
    runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .subscribe((updatedTree) => {
        expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
          dependencies: {
            'ag-grid-community': UPDATE_TO_VERSION,
            'ag-grid-angular': UPDATE_TO_VERSION,
          },
        });
        expect(updatedTree.readText('src/app/app.module.ts')).toMatchSnapshot();
      });
  });

  it('should remove @ag-grid-enterprise/all-modules when already on v28', function () {
    expect.assertions(2);
    setupTest({
      dependencies: {
        '@ag-grid-enterprise/all-modules': '27.1.1',
        'ag-grid-community': UPDATE_TO_VERSION,
        'ag-grid-angular': UPDATE_TO_VERSION,
        'ag-grid-enterprise': UPDATE_TO_VERSION,
      },
    });
    tree.create(
      'src/app/app.module.ts',
      `
        import { AgGridModule } from '@ag-grid-enterprise/all-modules';

        @NgModule({
          imports: [
            BrowserModule,
            AgGridModule,
          ],
        })
        export class AppModule {}`
    );
    const runner = new SchematicTestRunner(
      'schematics',
      require.resolve('../migration-collection.json')
    );
    runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .subscribe((updatedTree) => {
        expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
          dependencies: {
            'ag-grid-community': UPDATE_TO_VERSION,
            'ag-grid-angular': UPDATE_TO_VERSION,
            'ag-grid-enterprise': UPDATE_TO_VERSION,
          },
        });
        expect(updatedTree.readText('src/app/app.module.ts')).toMatchSnapshot();
      });
  });

  it('should update getSecondaryColumns and setSecondaryColumns', () => {
    expect.assertions(2);
    setupTest({
      dependencies: {
        'ag-grid-community': '27.1.1',
        'ag-grid-angular': '27.1.1',
      },
    });
    tree.create(
      'src/app/app.component.ts',
      `
        import { ColumnApi } from 'ag-grid-community';

        export class AppComponent {
          #columnApi: ColumnApi;

          public getSecondaryColumns() {
            return this.#columnApi.getSecondaryColumns();
          }
        }`
    );
    tree.create(
      'src/app/grid.component.ts',
      `
        import { ColumnApi } from 'ag-grid-community';

        export class GridComponent {
          #columnApi: ColumnApi;

          public setSecondaryColumns() {
            this.#columnApi.setSecondaryColumns([]);
          }
        }`
    );
    tree.create(
      'src/app/no-change.component.ts',
      `export class NoChangeComponent {}`
    );
    const runner = new SchematicTestRunner(
      'schematics',
      require.resolve('../migration-collection.json')
    );
    runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .subscribe((updatedTree) => {
        expect(
          updatedTree.readText('src/app/app.component.ts')
        ).toMatchSnapshot();
        expect(
          updatedTree.readText('src/app/grid.component.ts')
        ).toMatchSnapshot();
      });
  });
});
