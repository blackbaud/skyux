import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

describe('Migrations > Rename queryHarness methods', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../migration-collection.json'),
  );

  async function setup(): Promise<{
    runSchematic: () => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree = await createTestApp(runner, {
      projectName: 'foobar',
    });

    return {
      runSchematic: (): Promise<UnitTestTree> =>
        runner.runSchematic('rename-harness-queries', {}, tree),
      tree,
    };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should replace ".queryHarness(" with ".queryHarnessOrNull("', async () => {
    const { runSchematic, tree } = await setup();

    tree.overwrite(
      '/src/app/app.component.spec.ts',
      stripIndents`
        const lookupHarness = await (
          await rootLoader.getHarness(SkyInputBoxHarness)
        ).queryHarness(SkyLookupHarness);
        `,
    );

    await runSchematic();

    expect(tree.readText('/src/app/app.component.spec.ts'))
      .toEqual(stripIndents`
      const lookupHarness = await (
        await rootLoader.getHarness(SkyInputBoxHarness)
      ).queryHarnessOrNull(SkyLookupHarness);
      `);
  });
});
