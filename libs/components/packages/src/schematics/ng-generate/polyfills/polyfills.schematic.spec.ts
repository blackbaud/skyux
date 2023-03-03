import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('ng-generate/polyfills.schematic', () => {
  const collectionPath = path.join(__dirname, '../../../../collection.json');
  const runner = new SchematicTestRunner('generate', collectionPath);

  async function setupTest(options: { project?: string }) {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });

    const runSchematic = (
      config: { project?: string } = { project: options.project }
    ): Promise<UnitTestTree> => {
      return runner.runSchematic('polyfills', config, tree);
    };

    return { runSchematic, tree };
  }

  it("should add '@skyux/packages/polyfills' to workspace config", async () => {
    const { runSchematic, tree } = await setupTest({ project: 'test-app' });

    await runSchematic();

    const angularJson = JSON.parse(tree.readText('angular.json'));
    const architect = angularJson.projects['test-app'].architect;

    expect(architect.build.options.polyfills).toEqual([
      'zone.js',
      '@skyux/packages/polyfills',
    ]);

    expect(architect.test.options.polyfills).toEqual([
      'zone.js',
      'zone.js/testing',
      '@skyux/packages/polyfills',
    ]);
  });
});
