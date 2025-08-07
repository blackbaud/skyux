import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { resolve } from 'path';

import { createTestLibrary } from '../../../testing/scaffold';

describe('axe-core.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    resolve(__dirname, '../../migration-collection.json'),
  );

  async function setupTest(options?: {
    packageJson?: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
  }) {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });

    tree.overwrite('/package.json', JSON.stringify(options?.packageJson ?? {}));

    return {
      runSchematic: () => runner.runSchematic('axe-core', {}, tree),
      tree,
    };
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should update axe-core version if @skyux-sdk/testing installed', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        dependencies: {
          'axe-core': '*',
        },
        devDependencies: {
          '@skyux-sdk/testing': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {},
      devDependencies: {
        '@skyux-sdk/testing': '*',
        'axe-core': '~4.10.0',
      },
    });
  });

  it('should abort if @skyux-sdk/testing not installed', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          'axe-core': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: { 'axe-core': '*' },
    });
  });

  it('should install axe-core if @skyux-sdk/testing installed without', async () => {
    const { runSchematic, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          '@skyux-sdk/testing': '*',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: {
        '@skyux-sdk/testing': '*',
        'axe-core': '~4.10.0',
      },
    });
  });
});
