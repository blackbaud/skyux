import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../../testing/scaffold';
import { readJson } from '../../testing/tree';

describe('ng-generate/polyfills.schematic', () => {
  const collectionPath = path.join(__dirname, '../../../../collection.json');
  const runner = new SchematicTestRunner('generate', collectionPath);

  async function setupTest(options: {
    project?: string;
    builder?: string;
    targetOptions?: unknown;
  }) {
    const projectName = options.project || 'test-app';

    const tree = await createTestApp(runner, {
      projectName,
    });

    const angularJson = readJson(tree, 'angular.json');
    const architect = angularJson.projects[projectName].architect;

    if (options.targetOptions !== undefined) {
      architect.build.options = options.targetOptions;
      architect.test.options = options.targetOptions;
    }

    if (options.builder) {
      architect.build.builder = options.builder;
      architect.test.builder = options.builder;
    }

    tree.overwrite('angular.json', JSON.stringify(angularJson, undefined, 2));

    const runSchematic = (
      config: { project?: string } = { project: projectName }
    ): Promise<UnitTestTree> => {
      return runner.runSchematic('polyfills', config, tree);
    };

    return { runSchematic, tree };
  }

  function verifyPolyfill(tree: UnitTestTree): void {
    const angularJson = readJson(tree, 'angular.json');
    const architect = angularJson.projects['test-app'].architect;
    const polyfill = '@skyux/packages/polyfills';

    expect(architect.build.options.polyfills.includes(polyfill)).toEqual(true);
    expect(architect.test.options.polyfills.includes(polyfill)).toEqual(true);
  }

  it("should add '@skyux/packages/polyfills' to workspace config", async () => {
    const { runSchematic } = await setupTest({ project: 'test-app' });

    const updatedTree = await runSchematic();

    verifyPolyfill(updatedTree);
  });

  it("should not add '@skyux/packages/polyfills' if builder unapproved", async () => {
    const { runSchematic, tree } = await setupTest({
      project: 'test-app',
      builder: 'foobar',
      targetOptions: {},
    });

    await runSchematic();

    const angularJson = readJson(tree, 'angular.json');
    const architect = angularJson.projects['test-app'].architect;

    expect(architect.build.options.polyfills).toBeUndefined();
  });

  it('should handle empty options', async () => {
    const { runSchematic } = await setupTest({
      project: 'test-app',
      targetOptions: {},
    });

    const updatedTree = await runSchematic();

    verifyPolyfill(updatedTree);
  });

  it('should handle undefined options', async () => {
    const { runSchematic } = await setupTest({
      project: 'test-app',
      targetOptions: false,
    });

    const updatedTree = await runSchematic();

    verifyPolyfill(updatedTree);
  });
});
