import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../../testing/scaffold';

describe('Migrations > add forms/popover peer dependency', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    join(__dirname, '../../migration-collection.json')
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });

    return {
      runSchematic: () =>
        runner.runSchematic('add-forms-popovers-peer-dependency', {}, tree),
      tree,
    };
  }

  it('should add @skyux/popovers if @skyux/forms is installed in dependencies', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"dependencies": {"@skyux/forms": "9.0.0-alpha.1"}}'
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/forms': '9.0.0-alpha.1',
        '@skyux/popovers': '9.0.0-alpha.1',
      },
    });
  });

  it('should add @skyux/popovers if @skyux/forms is installed in devDependencies', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"devDependencies": {"@skyux/forms": "9.0.0-alpha.1"}}'
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/popovers': '9.0.0-alpha.1',
      },
      devDependencies: {
        '@skyux/forms': '9.0.0-alpha.1',
      },
    });
  });

  it('should not add @skyux/popovers if @skyux/forms is not installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite('/package.json', '{"dependencies": {}}');

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {},
    });
  });
});
