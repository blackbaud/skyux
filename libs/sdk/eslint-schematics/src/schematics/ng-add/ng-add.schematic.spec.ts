import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp, createTestLibrary } from '../testing/scaffold.js';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add', () => {
  async function setup(options: {
    angularEslintInstalled: boolean;
    projectType?: 'library' | 'application';
  }): Promise<{
    runSchematic: () => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

    const tree =
      options.projectType === 'library'
        ? await createTestLibrary(runner, {
            projectName: 'foo',
            setupEslint: options.angularEslintInstalled,
          })
        : await createTestApp(runner, {
            projectName: 'foo',
            setupEslint: options.angularEslintInstalled,
          });

    return {
      runSchematic: () => runner.runSchematic('ng-add', {}, tree),
      tree,
    };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should throw if angular-eslint not installed', async () => {
    const { runSchematic } = await setup({
      angularEslintInstalled: false,
    });

    await expect(() => runSchematic()).rejects.toThrow(
      "The package 'angular-eslint' is not installed. " +
        `Run 'ng add angular-eslint@19' and try this command again.\n` +
        'See: https://github.com/angular-eslint/angular-eslint#quick-start',
    );
  });

  it('should install dependencies', async () => {
    const { runSchematic } = await setup({
      angularEslintInstalled: true,
    });

    const tree = await runSchematic();

    const packageJson = JSON.parse(tree.readText('/package.json'));

    expect(packageJson.devDependencies['skyux-eslint']).toEqual(
      '^0.0.0-PLACEHOLDER',
    );
  });
});
