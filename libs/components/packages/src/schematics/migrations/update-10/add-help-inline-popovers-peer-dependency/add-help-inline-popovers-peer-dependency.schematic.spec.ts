import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../../testing/scaffold';

describe('Migrations > add help-inline/popovers peer dependency', () => {
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
        runner.runSchematic(
          'add-help-inline-popovers-peer-dependency',
          {},
          tree,
        ),
      tree,
    };
  }

  it('should add @skyux/popovers if @skyux/help-inline is installed in dependencies', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"dependencies": {"@skyux/help-inline": "10.26.0"}}',
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/help-inline': '10.26.0',
        '@skyux/popovers': '10.26.0',
      },
    });
  });

  it('should add @skyux/popovers if @skyux/help-inline is installed in devDependencies', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"devDependencies": {"@skyux/help-inline": "10.26.0"}}',
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/popovers': '10.26.0',
      },
      devDependencies: {
        '@skyux/help-inline': '10.26.0',
      },
    });
  });

  it('should not add @skyux/popovers if @skyux/help-inline is not installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite('/package.json', '{"dependencies": {}}');

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {},
    });
  });
});
