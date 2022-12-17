import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { map } from 'rxjs/operators';

import { UPDATE_TO_VERSION } from './ag-grid-28.schematic';

describe('ag-grid-28.schematic', () => {
  let tree: Tree;
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../migration-collection.json')
  );
  const angularJson = {
    version: 1,
    projects: {
      test: {
        projectType: 'application',
        root: '',
        architect: {},
      },
    },
  };

  function setupTest(packageJson: { [key: string]: any } = {}) {
    tree = Tree.empty();
    tree.create('/angular.json', JSON.stringify(angularJson));
    tree.create('/package.json', JSON.stringify(packageJson));
  }

  it('should work', async () => {
    expect.assertions(1);
    setupTest({
      dependencies: {
        'ag-grid-community': UPDATE_TO_VERSION,
        'ag-grid-angular': UPDATE_TO_VERSION,
        'ag-grid-enterprise': UPDATE_TO_VERSION,
      },
    });
    await runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .pipe(
        map((updatedTree) =>
          expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
            dependencies: {
              'ag-grid-community': UPDATE_TO_VERSION,
              'ag-grid-angular': UPDATE_TO_VERSION,
              'ag-grid-enterprise': UPDATE_TO_VERSION,
            },
          })
        )
      )
      .toPromise();
  });

  it('should noop', async () => {
    expect.assertions(1);
    setupTest({
      dependencies: {
        other: '27.1.1',
      },
    });
    await runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .pipe(
        map((updatedTree) =>
          expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
            dependencies: {
              other: '27.1.1',
            },
          })
        )
      )
      .toPromise();
  });

  it('should swap @ag-grid-community/all-modules', async () => {
    expect.assertions(1);
    setupTest({
      devDependencies: {
        '@ag-grid-community/all-modules': '27.1.1',
        '@ag-grid-enterprise/all-modules': '27.1.1',
      },
    });
    tree.overwrite(
      '/angular.json',
      JSON.stringify({
        ...angularJson,
        projects: {
          test: {
            ...angularJson.projects.test,
            sourceRoot: 'src',
          },
        },
      })
    );
    await runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .pipe(
        map((updatedTree) =>
          expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
            devDependencies: {
              'ag-grid-community': UPDATE_TO_VERSION,
              'ag-grid-angular': UPDATE_TO_VERSION,
              'ag-grid-enterprise': UPDATE_TO_VERSION,
            },
          })
        )
      )
      .toPromise();
  });

  it('should remove @ag-grid-community/all-modules', async () => {
    expect.assertions(4);
    setupTest({
      dependencies: {
        '@ag-grid-community/all-modules': '27.1.1',
        '@ag-grid-enterprise/all-modules': '27.1.1',
        'ag-grid-community': UPDATE_TO_VERSION,
        'ag-grid-angular': UPDATE_TO_VERSION,
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
    const warnSpy = jest.fn();
    const logSubscription = runner.logger.subscribe((log) => {
      if (log.level === 'warn') {
        warnSpy(log.message);
      }
    });
    await runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .pipe(
        map((updatedTree) => {
          expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
            dependencies: {
              'ag-grid-community': UPDATE_TO_VERSION,
              'ag-grid-angular': UPDATE_TO_VERSION,
              'ag-grid-enterprise': UPDATE_TO_VERSION,
            },
          });
          expect(
            updatedTree.readText('src/app/app.module.ts')
          ).toMatchSnapshot();
          expect(warnSpy).toHaveBeenCalled();
          expect(warnSpy.mock.calls[0][0]).toMatchSnapshot();
        })
      )
      .toPromise();
    logSubscription.unsubscribe();
  });

  it('should remove @ag-grid-community/all-modules when already on v28', async () => {
    expect.assertions(3);
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
    tree.create(
      'src/app/grid.module.ts',
      `
        import { AgGridModule } from '@ag-grid-community/all-modules';

        @NgModule({
          imports: [
            BrowserModule,
            AgGridModule.forRoot([
              OtherComponent,
            ]),
          ],
        })
        export class GridModule {}`
    );
    // File that does not end in .ts and should not be changed.
    tree.create('src/app/app.component.css', `code { display: none; }`);
    await runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .pipe(
        map((updatedTree) => {
          expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
            dependencies: {
              'ag-grid-community': UPDATE_TO_VERSION,
              'ag-grid-angular': UPDATE_TO_VERSION,
            },
          });
          expect(
            updatedTree.readText('src/app/app.module.ts')
          ).toMatchSnapshot();
          expect(
            updatedTree.readText('src/app/grid.module.ts')
          ).toMatchSnapshot();
        })
      )
      .toPromise();
  });

  it('should remove @ag-grid-enterprise/all-modules when already on v28', async () => {
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
    await runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .pipe(
        map((updatedTree) => {
          expect(JSON.parse(updatedTree.readText('/package.json'))).toEqual({
            dependencies: {
              'ag-grid-community': UPDATE_TO_VERSION,
              'ag-grid-angular': UPDATE_TO_VERSION,
              'ag-grid-enterprise': UPDATE_TO_VERSION,
            },
          });
          expect(
            updatedTree.readText('src/app/app.module.ts')
          ).toMatchSnapshot();
        })
      )
      .toPromise();
  });

  it('should update getSecondaryColumns and setSecondaryColumns', async () => {
    expect.assertions(2);
    setupTest({
      dependencies: {
        'ag-grid-community': UPDATE_TO_VERSION,
        'ag-grid-angular': UPDATE_TO_VERSION,
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
    await runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .pipe(
        map((updatedTree) => {
          expect(
            updatedTree.readText('src/app/app.component.ts')
          ).toMatchSnapshot();
          expect(
            updatedTree.readText('src/app/grid.component.ts')
          ).toMatchSnapshot();
        })
      )
      .toPromise();
  });

  it('should update suppressCellSelection', async () => {
    expect.assertions(1);
    setupTest({
      dependencies: {
        '@skyux/ag-grid': '0.0.0',
        'ag-grid-community': UPDATE_TO_VERSION,
        'ag-grid-angular': UPDATE_TO_VERSION,
      },
    });
    tree.create(
      'src/app/app.component.ts',
      `
        import { SkyAgGridService } from '@skyux/ag-grid';
        import { GridOptions } from 'ag-grid-community';

        export class AppComponent {
          public options: GridOptions;
          #agGridService: SkyAgGridService;

          constructor(agGridService: SkyAgGridService) {
            this.#agGridService = agGridService;
            let customOptions: Partial<GridOptions> = {};
            customOptions.suppressCellSelection = true;
            this.options = this.agGridService.getGridOptions({
              ...customOptions,
              suppressCellSelection: true,
            });
          }
        }`
    );
    tree.create(
      'src/app/no-change.component.ts',
      `export class NoChangeComponent {}`
    );
    await runner
      .runSchematicAsync('ag-grid-28', {}, tree)
      .pipe(
        map((updatedTree) => {
          expect(
            updatedTree.readText('src/app/app.component.ts')
          ).toMatchSnapshot();
        })
      )
      .toPromise();
  });
});
