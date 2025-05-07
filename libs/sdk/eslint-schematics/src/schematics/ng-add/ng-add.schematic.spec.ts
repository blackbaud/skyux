import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp, createTestLibrary } from '../testing/scaffold.js';
import { JsonFile } from '../utility/json-file';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add', () => {
  async function setup(options: {
    angularEslintInstalled: boolean;
    eslintVersion?: string;
    projectType?: 'library' | 'application';
    rulesetPromptResult?: 'recommended' | 'strict-type-checked';
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

  it('should modify tsconfig.json', async () => {
    const { runSchematic, tree } = await setup({
      angularEslintInstalled: true,
    });

    let tsconfig = new JsonFile(tree, '/tsconfig.json');
    tsconfig.remove(['compilerOptions', 'strict']);

    expect(
      tsconfig.get(['compilerOptions', 'strictNullChecks']),
    ).toBeUndefined();

    const updatedTree = await runSchematic();

    tsconfig = new JsonFile(updatedTree, '/tsconfig.json');

    expect(tsconfig.get(['compilerOptions', 'strictNullChecks'])).toEqual(true);
  });

  it('should not modify tsconfig.json if "strict"', async () => {
    const { runSchematic, tree } = await setup({
      angularEslintInstalled: true,
    });

    let tsconfig = new JsonFile(tree, '/tsconfig.json');
    tsconfig.modify(['compilerOptions', 'strict'], true);

    const updatedTree = await runSchematic();

    tsconfig = new JsonFile(updatedTree, '/tsconfig.json');

    expect(
      tsconfig.get(['compilerOptions', 'strictNullChecks']),
    ).toBeUndefined();
  });
});
