import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Add axe-core as a dependency', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    join(__dirname, '../migration-collection.json')
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });

    return {
      runSchematic: () =>
        runner
          .runSchematicAsync('add-axe-core-dependency', {}, tree)
          .toPromise(),
      tree,
    };
  }

  it('should add axe-core as a dependency if @skyux-sdk/testing installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"devDependencies": { "@skyux-sdk/testing": "7.0.0"}}'
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      devDependencies: {
        '@skyux-sdk/testing': '7.0.0',
        'axe-core': '3.5.6',
      },
    });
  });

  it('should not add axe-core as a dependency if @skyux-sdk/testing not installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite('/package.json', '{}');

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({});
  });
});
