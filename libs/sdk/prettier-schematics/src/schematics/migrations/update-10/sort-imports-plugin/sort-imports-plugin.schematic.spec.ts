import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { resolve } from 'path';

import { createTestLibrary } from '../../../testing/scaffold';

describe('fixSortImportsPlugin', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    resolve(__dirname, '../../migration-collection.json'),
  );

  async function setupTest(options?: {
    prettierConfig?: Record<string, unknown>;
    packageJson?: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
  }) {
    const tree = await createTestLibrary(runner, {
      name: 'my-lib',
    });

    tree.overwrite('/package.json', JSON.stringify(options?.packageJson ?? {}));

    if (options?.prettierConfig) {
      tree.create('.prettierrc.json', JSON.stringify(options.prettierConfig));
    }

    return {
      runSchematic: () => runner.runSchematic('sort-imports-plugin', {}, tree),
      tree,
    };
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should add @trivago/prettier-plugin-sort-imports to plugins if installed', async () => {
    const { runSchematic, tree } = await setupTest({
      prettierConfig: {
        singleQuote: true,
      },
      packageJson: {
        devDependencies: {
          '@trivago/prettier-plugin-sort-imports': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('/.prettierrc.json'))).toEqual({
      singleQuote: true,
      plugins: ['@trivago/prettier-plugin-sort-imports'],
    });
  });

  it('should not add @trivago/prettier-plugin-sort-imports to plugins if uninstalled', async () => {
    const { runSchematic, tree } = await setupTest({
      prettierConfig: {
        singleQuote: true,
      },
      packageJson: {},
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('/.prettierrc.json'))).toEqual({
      singleQuote: true,
    });
  });

  it('should not add @trivago/prettier-plugin-sort-imports to plugins if already added', async () => {
    const { runSchematic, tree } = await setupTest({
      prettierConfig: {
        singleQuote: true,
        plugins: ['@trivago/prettier-plugin-sort-imports'],
      },
      packageJson: {
        dependencies: {
          '@trivago/prettier-plugin-sort-imports': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('/.prettierrc.json'))).toEqual({
      singleQuote: true,
      plugins: ['@trivago/prettier-plugin-sort-imports'],
    });
  });
});
