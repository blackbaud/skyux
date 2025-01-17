import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import fs from 'fs-extra';
import { joinPathFragments } from 'nx/src/utils/path';
import { workspaceRoot } from 'nx/src/utils/workspace-root';

const UPDATE_TO_VERSION = '32.3.3';

describe('ag-grid.schematic', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../migration-collection.json'),
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

  function setupTest(
    packageJson: Record<string, Record<string, string>> = {},
  ): { tree: Tree } {
    const tree = Tree.empty();
    tree.create('/angular.json', JSON.stringify(angularJson));
    tree.create('/package.json', JSON.stringify(packageJson));
    return { tree };
  }

  it('should test the current version', () => {
    const packageJson = fs.readJSONSync(
      joinPathFragments(workspaceRoot, 'package.json'),
    );
    expect(packageJson.dependencies['ag-grid-community']).toBe(
      UPDATE_TO_VERSION,
    );
  });

  it('should work', async () => {
    expect.assertions(1);
    const { tree } = setupTest({
      dependencies: {
        'ag-grid-community': UPDATE_TO_VERSION,
        'ag-grid-angular': UPDATE_TO_VERSION,
        'ag-grid-enterprise': UPDATE_TO_VERSION,
      },
    });
    await runner.runSchematic('ag-grid', {}, tree);
    expect(JSON.parse(tree.readText('/package.json'))).toEqual({
      dependencies: {
        'ag-grid-community': UPDATE_TO_VERSION,
        'ag-grid-angular': UPDATE_TO_VERSION,
        'ag-grid-enterprise': UPDATE_TO_VERSION,
      },
    });
  });

  it('should add missing peer', async () => {
    expect.assertions(1);
    const { tree } = setupTest({
      dependencies: {
        'ag-grid-angular': UPDATE_TO_VERSION,
      },
    });
    await runner.runSchematic('ag-grid', {}, tree);
    expect(JSON.parse(tree.readText('/package.json'))).toEqual({
      dependencies: {
        'ag-grid-community': `^${UPDATE_TO_VERSION}`,
        'ag-grid-angular': UPDATE_TO_VERSION,
      },
    });
  });

  it('should noop', async () => {
    expect.assertions(1);
    const { tree } = setupTest({
      dependencies: {
        other: '27.1.1',
      },
    });
    await runner.runSchematic('ag-grid', {}, tree);
    expect(JSON.parse(tree.readText('/package.json'))).toEqual({
      dependencies: {
        other: '27.1.1',
      },
    });
  });

  it('should warn about mixing modules and packages', async () => {
    expect.assertions(1);
    const { tree } = setupTest({
      dependencies: {
        '@ag-grid-community/core': UPDATE_TO_VERSION,
        '@skyux/ag-grid': '0.0.0',
        'ag-grid-community': UPDATE_TO_VERSION,
        'ag-grid-angular': UPDATE_TO_VERSION,
      },
    });
    tree.create(
      'src/app/app.component.ts',
      `
        import { SkyAgGridService } from '@skyux/ag-grid';
        import { GridOptions } from '@ag-grid-community/core';

        export class AppComponent {
          public options: GridOptions;
          #agGridService: SkyAgGridService;

          constructor(agGridService: SkyAgGridService) {
            this.#agGridService = agGridService;
            let customOptions: Partial<GridOptions> = {};
            customOptions.suppressCellSelection = true;
            this.options = this.agGridService.getGridOptions({
              ...customOptions,
              suppressCellSelection: true
            });
          }
        }`,
    );
    tree.create(
      'src/app/ent.component.ts',
      `
        import { SkyAgGridService } from '@skyux/ag-grid';
        import { GridOptions } from '@ag-grid-enterprise/core';

        export class AppComponent {
          public options: GridOptions;
          #agGridService: SkyAgGridService;

          constructor(agGridService: SkyAgGridService) {
            this.#agGridService = agGridService;
            let customOptions: Partial<GridOptions> = {};
            customOptions.suppressCellSelection = true;
            this.options = this.agGridService.getGridOptions({
              ...customOptions,
              suppressCellSelection: true
            });
          }
        }`,
    );
    tree.create(
      'src/app/options.component.ts',
      `import { SkyGetGridOptionsArgs } from '@skyux/ag-grid';`,
    );
    tree.create(
      'src/app/other.component.ts',
      `import { ColDef } from '@ag-grid-community/core';`,
    );
    tree.create('src/app/unrelated.component.ts', `// No grid.`);
    await runner.runSchematic('ag-grid', {}, tree);
    expect(tree.readText('src/app/other.component.ts')).toEqual(
      `import { ColDef } from '@ag-grid-community/core';`,
    );
  });
});
