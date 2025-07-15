import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestLibrary } from '../testing/scaffold';
import { readJson } from '../testing/tree';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add.schematic', () => {
  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  const defaultProjectName = 'my-lib';

  async function setupTest(): Promise<{
    runSchematic: (options?: { project?: string }) => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree = await createTestLibrary(runner, {
      projectName: defaultProjectName,
    });

    const runSchematic = (
      options: { project?: string } = {},
    ): Promise<UnitTestTree> => {
      return runner.runSchematic('ng-add', options, tree);
    };

    return {
      runSchematic,
      tree,
    };
  }

  it('should install @angular/cdk', async () => {
    const { runSchematic } = await setupTest();

    const updatedTree = await runSchematic({ project: defaultProjectName });
    const packageJson = readJson(updatedTree, 'package.json');

    expect(packageJson.dependencies['@angular/cdk']).toBeDefined();
  });

  it('should install essential SKY UX packages', async () => {
    const { runSchematic } = await setupTest();

    const updatedTree = await runSchematic({ project: defaultProjectName });
    const packageJson = readJson(updatedTree, 'package.json');

    const packageNames = [
      '@skyux/assets',
      '@skyux/core',
      '@skyux/i18n',
      '@skyux/theme',
    ];

    for (const packageName of packageNames) {
      expect(packageJson.dependencies[packageName]).toEqual(
        '^0.0.0-PLACEHOLDER',
      );
    }
  });

  it('should add SKY UX theme stylesheets', async () => {
    const { runSchematic } = await setupTest();

    const updatedTree = await runSchematic({ project: 'my-lib-showcase' });
    const angularJson = readJson(updatedTree, 'angular.json');

    expect(
      angularJson.projects['my-lib-showcase'].architect.build.options.styles,
    ).toEqual([
      '@skyux/theme/css/sky.css',
      '@skyux/theme/css/themes/modern/styles.css',
      'projects/my-lib-showcase/src/styles.css',
    ]);
  });

  it('should add SKY UX theme stylesheets if styles array missing', async () => {
    const { runSchematic, tree } = await setupTest();

    // Delete the styles array for the test target.
    const angularJson = readJson(tree, 'angular.json');
    const architect = angularJson.projects['my-lib-showcase'].architect;
    delete architect.test.options.styles;
    tree.overwrite('angular.json', JSON.stringify(angularJson, undefined, 2));

    const updatedTree = await runSchematic({ project: 'my-lib-showcase' });
    const updatedAngularJson = readJson(updatedTree, 'angular.json');

    expect(
      updatedAngularJson.projects['my-lib-showcase'].architect.test.options
        .styles,
    ).toEqual([
      '@skyux/theme/css/sky.css',
      '@skyux/theme/css/themes/modern/styles.css',
    ]);
  });

  it('should add @skyux/packages/polyfills', async () => {
    const { runSchematic } = await setupTest();

    const updatedTree = await runSchematic({ project: 'my-lib-showcase' });
    const angularJson = readJson(updatedTree, 'angular.json');
    const architect = angularJson.projects['my-lib-showcase'].architect;

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

  it('should add @skyux/packages/polyfills if polyfills exist as a string', async () => {
    const { runSchematic, tree } = await setupTest();
    let angularJson = readJson(tree, 'angular.json');
    let architect = angularJson.projects['my-lib-showcase'].architect;
    architect.build.options.polyfills = 'testPolyfill.js';
    architect.test.options.polyfills = 'testPolyfill.js';
    tree.overwrite('angular.json', JSON.stringify(angularJson, undefined, 2));

    const updatedTree = await runSchematic({ project: 'my-lib-showcase' });
    angularJson = readJson(updatedTree, 'angular.json');
    architect = angularJson.projects['my-lib-showcase'].architect;

    expect(architect.build.options.polyfills).toEqual([
      'testPolyfill.js',
      '@skyux/packages/polyfills',
    ]);

    expect(architect.test.options.polyfills).toEqual([
      'testPolyfill.js',
      '@skyux/packages/polyfills',
    ]);
  });
});
