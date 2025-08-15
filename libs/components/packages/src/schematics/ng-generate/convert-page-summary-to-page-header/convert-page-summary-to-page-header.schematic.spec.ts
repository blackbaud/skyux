import { join, normalize } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

describe('ng-generate/convert-page-summary-to-page-header.schematic', () => {
  const collectionPath = join(
    normalize(__dirname),
    '../../../../collection.json',
  );
  const runner = new SchematicTestRunner('generate', collectionPath);

  async function setupTest(): Promise<{
    runSchematic: (options: object) => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const runSchematic = (options: object): Promise<UnitTestTree> => {
      return runner.runSchematic(
        'convert-page-summary-to-page-header',
        options,
        tree,
      );
    };
    return { runSchematic, tree };
  }

  it('should run the schematic without errors', async () => {
    const { runSchematic } = await setupTest();
    await expect(
      runSchematic({
        project: 'test-app',
      }),
    ).resolves.not.toThrow();
  });

  it('should run the schematic without specifying a project', async () => {
    const { runSchematic } = await setupTest();
    await expect(runSchematic({})).resolves.not.toThrow();
  });
});
