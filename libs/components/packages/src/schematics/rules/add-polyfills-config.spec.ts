import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';
import { lastValueFrom } from 'rxjs';

import { createTestApp } from '../testing/scaffold';
import { readJson } from '../testing/tree';

import { addPolyfillsConfig } from './add-polyfills-config';

describe('addPolyfillsConfig', () => {
  const collectionPath = path.join(__dirname, '../../../collection.json');
  const runner = new SchematicTestRunner('generate', collectionPath);

  async function setupTest(options: {
    project?: string;
    builder?: string;
    targetOptions?: unknown;
  }): Promise<{ tree: UnitTestTree; projectName: string }> {
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

    return { tree, projectName };
  }

  it('should handle polyfills as an object (edge case for normalizePolyfills)', async () => {
    const { tree, projectName } = await setupTest({
      project: 'test-app',
      targetOptions: {
        polyfills: { invalid: 'object' }, // This will trigger the `return []` branch
      },
    });

    const rule = addPolyfillsConfig(projectName, ['build', 'test']);
    const updatedTree = (await lastValueFrom(
      runner.callRule(rule, tree),
    )) as UnitTestTree;

    const angularJson = readJson(updatedTree, 'angular.json');
    const architect = angularJson.projects[projectName].architect;
    const polyfill = '@skyux/packages/polyfills';

    // Should add the polyfill even when the original polyfills was an invalid object
    expect(architect.build.options.polyfills).toEqual([polyfill]);
    expect(architect.test.options.polyfills).toEqual([polyfill]);
  });

  it('should handle polyfills as a number (another edge case for normalizePolyfills)', async () => {
    const { tree, projectName } = await setupTest({
      project: 'test-app',
      targetOptions: {
        polyfills: 123, // This will also trigger the `return []` branch
      },
    });

    const rule = addPolyfillsConfig(projectName, ['build', 'test']);
    const updatedTree = (await lastValueFrom(
      runner.callRule(rule, tree),
    )) as UnitTestTree;

    const angularJson = readJson(updatedTree, 'angular.json');
    const architect = angularJson.projects[projectName].architect;
    const polyfill = '@skyux/packages/polyfills';

    // Should add the polyfill even when the original polyfills was a number
    expect(architect.build.options.polyfills).toEqual([polyfill]);
    expect(architect.test.options.polyfills).toEqual([polyfill]);
  });

  it('should preserve existing string polyfills', async () => {
    const { tree, projectName } = await setupTest({
      project: 'test-app',
      targetOptions: {
        polyfills: 'zone.js',
      },
    });

    const rule = addPolyfillsConfig(projectName, ['build', 'test']);
    const updatedTree = (await lastValueFrom(
      runner.callRule(rule, tree),
    )) as UnitTestTree;

    const angularJson = readJson(updatedTree, 'angular.json');
    const architect = angularJson.projects[projectName].architect;
    const polyfill = '@skyux/packages/polyfills';

    // Should preserve existing string polyfill and add the new one
    expect(architect.build.options.polyfills).toEqual(['zone.js', polyfill]);
    expect(architect.test.options.polyfills).toEqual(['zone.js', polyfill]);
  });

  it('should preserve existing array polyfills', async () => {
    const { tree, projectName } = await setupTest({
      project: 'test-app',
      targetOptions: {
        polyfills: ['zone.js', 'core-js'],
      },
    });

    const rule = addPolyfillsConfig(projectName, ['build', 'test']);
    const updatedTree = (await lastValueFrom(
      runner.callRule(rule, tree),
    )) as UnitTestTree;

    const angularJson = readJson(updatedTree, 'angular.json');
    const architect = angularJson.projects[projectName].architect;
    const polyfill = '@skyux/packages/polyfills';

    // Should preserve existing array polyfills and add the new one
    expect(architect.build.options.polyfills).toEqual([
      'zone.js',
      'core-js',
      polyfill,
    ]);
    expect(architect.test.options.polyfills).toEqual([
      'zone.js',
      'core-js',
      polyfill,
    ]);
  });

  it('should not add duplicate polyfills', async () => {
    const { tree, projectName } = await setupTest({
      project: 'test-app',
      targetOptions: {
        polyfills: ['@skyux/packages/polyfills'],
      },
    });

    const rule = addPolyfillsConfig(projectName, ['build', 'test']);
    const updatedTree = (await lastValueFrom(
      runner.callRule(rule, tree),
    )) as UnitTestTree;

    const angularJson = readJson(updatedTree, 'angular.json');
    const architect = angularJson.projects[projectName].architect;

    // Should not duplicate the polyfill
    expect(architect.build.options.polyfills).toEqual([
      '@skyux/packages/polyfills',
    ]);
    expect(architect.test.options.polyfills).toEqual([
      '@skyux/packages/polyfills',
    ]);
  });
});
