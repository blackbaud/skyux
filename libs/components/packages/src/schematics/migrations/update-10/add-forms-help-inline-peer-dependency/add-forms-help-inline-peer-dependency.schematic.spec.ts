import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../../testing/scaffold';

describe('Migrations > add forms/popovers peer dependency', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    join(__dirname, '../../migration-collection.json'),
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });

    return {
      runSchematic: () =>
        runner.runSchematic('add-forms-help-inline-peer-dependency', {}, tree),
      tree,
    };
  }

  it('should add @skyux/help-inline if @skyux/forms is installed in dependencies', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"dependencies": {"@skyux/forms": "10.7.0"}}',
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/forms': '10.7.0',
        '@skyux/help-inline': '10.7.0',
      },
    });
  });

  it('should add @skyux/help-inline if @skyux/forms is installed in devDependencies', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"devDependencies": {"@skyux/forms": "10.7.0"}}',
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/help-inline': '10.7.0',
      },
      devDependencies: {
        '@skyux/forms': '10.7.0',
      },
    });
  });

  it('should not add @skyux/help-inline if @skyux/forms is not installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite('/package.json', '{"dependencies": {}}');

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {},
    });
  });
});
