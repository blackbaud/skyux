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
    runSchematic: () => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const runSchematic = (): Promise<UnitTestTree> => {
      return runner.runSchematic(
        'convert-page-summary-to-page-header',
        {
          project: 'test-app',
        },
        tree,
      );
    };
    return { runSchematic, tree };
  }

  it('should run the schematic without errors', async () => {
    const { runSchematic } = await setupTest();
    await expect(runSchematic()).resolves.not.toThrow();
  });
});
