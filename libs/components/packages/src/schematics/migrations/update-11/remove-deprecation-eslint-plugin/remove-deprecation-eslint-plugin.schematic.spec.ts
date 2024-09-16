import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { resolve } from 'path';

import { createTestLibrary } from '../../../testing/scaffold';

describe('remove-deprecation-eslint-plugin.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    resolve(__dirname, '../../migration-collection.json'),
  );

  async function setupTest(options?: {
    packageJson?: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    eslintConfig?: any;
  }) {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });

    tree.overwrite('/package.json', JSON.stringify(options?.packageJson ?? {}));
    tree.create('/.eslintrc.json', JSON.stringify(options?.eslintConfig ?? {}));

    return {
      runSchematic: () =>
        runner.runSchematic('remove-deprecation-eslint-plugin', {}, tree),
      tree,
    };
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should remove eslint-plugin-deprecation version if @skyux-sdk/eslint-config installed as a dependency', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        dependencies: {
          'eslint-plugin-deprecation': '*',
        },
        devDependencies: {
          '@skyux-sdk/eslint-config': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {},
      devDependencies: {
        '@skyux-sdk/eslint-config': '*',
      },
    });
  });

  it('should remove eslint-plugin-deprecation version if @skyux-sdk/eslint-config installed as a dev-dependency', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          '@skyux-sdk/eslint-config': '*',
          'eslint-plugin-deprecation': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: {
        '@skyux-sdk/eslint-config': '*',
      },
    });
  });

  it('should abort if @skyux-sdk/eslint-config not installed', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          'eslint-plugin-deprecation': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: { 'eslint-plugin-deprecation': '*' },
    });
  });

  it('should abort if consumer has an eslint file that directly references the plugin', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          '@skyux-sdk/eslint-config': '*',
          'eslint-plugin-deprecation': '*',
        },
      },
      eslintConfig: {
        plugins: ['deprecation'],
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: {
        '@skyux-sdk/eslint-config': '*',
        'eslint-plugin-deprecation': '*',
      },
    });
  });
});
