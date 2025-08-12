import { join, normalize } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { createTestApp, createTestLibrary } from '../../testing/scaffold';

describe('ng-generate/convert-progress-indicator-wizard-to-tab-wizard.schematic', () => {
  const collectionPath = join(
    normalize(__dirname),
    '../../../../collection.json',
  );
  const runner = new SchematicTestRunner('generate', collectionPath);

  async function setupTest(appOrLib: 'app' | 'lib' = 'app'): Promise<{
    runSchematic: (options: object) => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree =
      appOrLib === 'app'
        ? await createTestApp(runner, { projectName: 'test-app' })
        : await createTestLibrary(runner, { projectName: 'test-lib' });
    const runSchematic = (options: object): Promise<UnitTestTree> => {
      return runner.runSchematic(
        'convert-progress-indicator-wizard-to-tab-wizard',
        options,
        tree,
      );
    };
    return { runSchematic, tree };
  }

  it('should run the schematic without errors', async () => {
    const { runSchematic } = await setupTest();
    await expect(runSchematic({})).resolves.not.toThrow();
  });

  it('should error without a clear project', async () => {
    const { runSchematic } = await setupTest('lib');
    await expect(runSchematic({})).rejects.toThrow(
      new Error(
        'Project name is required. Provide a valid project name using the `--project` option.',
      ),
    );
  });
});
