import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../../testing/scaffold';

describe('Migrations > Update autonumeric', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    join(__dirname, '../../migration-collection.json')
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });

    return {
      runSchematic: () => runner.runSchematic('update-autonumeric', {}, tree),
      tree,
    };
  }

  it('should not install autonumeric as a dependency if autonumeric is not installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"dependencies": { "@skyux/core": "8.0.0"}}'
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/core': '8.0.0',
      },
    });
  });

  it('should update autonumeric if it is installed', async () => {
    const { runSchematic, tree } = await setupTest();

    // Add autonumeric to both dependencies and devDependencies.
    tree.overwrite(
      '/package.json',
      JSON.stringify({
        dependencies: {
          '@skyux/autonumeric': '8.0.0',
          autonumeric: '4.6.0',
        },
      })
    );

    await runSchematic();

    // The version listed in devDependencies should be removed.
    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/autonumeric': '8.0.0',
        autonumeric: '4.8.1',
      },
    });
  });

  it('should leave autonumeric as is if it is already at 4.8.1', async () => {
    const { runSchematic, tree } = await setupTest();

    // Add autonumeric to both dependencies and devDependencies.
    tree.overwrite(
      '/package.json',
      JSON.stringify({
        dependencies: {
          '@skyux/autonumeric': '8.0.0',
          autonumeric: '4.8.1',
        },
      })
    );

    await runSchematic();

    // The version listed in devDependencies should be removed.
    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/autonumeric': '8.0.0',
        autonumeric: '4.8.1',
      },
    });
  });
});
