import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../testing/scaffold';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add.schematic', () => {
  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  const projectName = 'my-app';

  function readPackageJson(tree: UnitTestTree): PackageJson {
    return tree.readJson('/package.json') as PackageJson;
  }

  async function setupTest(options: { packageJson?: PackageJson }): Promise<{
    runSchematic: (options?: { project?: string }) => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree = await createTestApp(runner, {
      projectName,
    });

    let packageJson = options.packageJson;

    if (!options.packageJson) {
      packageJson = readPackageJson(tree);
      packageJson.devDependencies ??= {};
      packageJson.devDependencies['@angular-eslint/schematics'] = '*';
    }

    tree.overwrite('package.json', JSON.stringify(packageJson));

    const runSchematic = (
      options: { project?: string } = {},
    ): Promise<UnitTestTree> => {
      return runner.runSchematic('ng-add', options, tree);
    };

    return {
      runSchematic,
      tree,
    };
  }

  it("should abort if '@angular-eslint/schematics' is not installed", async () => {
    const { runSchematic } = await setupTest({
      packageJson: {
        devDependencies: {}, // <-- empty
      },
    });

    await expect(() => runSchematic()).rejects.toThrow(
      new Error(
        "The package 'angular-eslint' is not installed. " +
          "Run 'ng add @angular-eslint/schematics' and try this command again.\n" +
          'See: https://github.com/angular-eslint/angular-eslint#quick-start',
      ),
    );
  });

  it("should not abort if 'angular-eslint' is installed", async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          'angular-eslint': '*',
        },
      },
    });

    await runSchematic();

    const packageJson = readPackageJson(tree);

    expect(packageJson.devDependencies?.['skyux-eslint']).toBeDefined();
  });

  it('should harden the version of the skyux-eslint package', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          '@angular-eslint/schematics': '*',
        },
      },
    });

    await runSchematic();

    const packageJson = readPackageJson(tree);

    expect(packageJson.devDependencies?.['skyux-eslint']).toEqual(
      '0.0.0-PLACEHOLDER',
    );
  });
});
