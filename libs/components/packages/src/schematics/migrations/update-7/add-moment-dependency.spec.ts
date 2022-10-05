import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Add moment.js as a dependency', () => {
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
        runner.runSchematicAsync('add-moment-dependency', {}, tree).toPromise(),
      tree,
    };
  }

  it('should add moment as a dependency', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite('/package.json', '{}');

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: { moment: '2.29.4' },
    });
  });

  it('should not add moment if already installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite('/package.json', '{ "devDependencies": { "moment": "1" } }');

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      devDependencies: { moment: '1' },
    });
  });
});
