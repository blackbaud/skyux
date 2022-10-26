import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Add autonumeric as a dependency', () => {
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
          .runSchematicAsync('add-autonumeric-dependency', {}, tree)
          .toPromise(),
      tree,
    };
  }

  it('should add autonumeric as a dependency if @skyux/autonumeric installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"dependencies": { "@skyux/autonumeric": "7.0.0"}}'
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/autonumeric': '7.0.0',
        autonumeric: '4.6.0',
      },
    });
  });

  it('should not add autonumeric as a dependency if @skyux/autonumeric not installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite('/package.json', '{}');

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({});
  });
});
