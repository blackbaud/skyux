import { normalize } from '@angular-devkit/core';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestLibrary } from '../testing/scaffold';
import { readJson } from '../testing/tree';
import { JsonFile } from '../utility/json-file';

const COLLECTION_PATH = normalize(`${__dirname}/../../../collection.json`);

describe('ng-add.schematic', () => {
  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  const defaultProjectName = 'my-lib';

  async function setupTest() {
    const tree = await createTestLibrary(runner, {
      projectName: defaultProjectName,
    });

    const runSchematic = (options: { project?: string } = {}) => {
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
        '^0.0.0-PLACEHOLDER'
      );
    }
  });

  it('should add SKY UX theme stylesheets', async () => {
    const { runSchematic } = await setupTest();

    const updatedTree = await runSchematic({ project: 'my-lib-showcase' });
    const angularJson = readJson(updatedTree, 'angular.json');

    expect(
      angularJson.projects['my-lib-showcase'].architect.build.options.styles
    ).toEqual([
      'node_modules/@skyux/theme/css/sky.css',
      'node_modules/@skyux/theme/css/themes/modern/styles.css',
      'projects/my-lib-showcase/src/styles.css',
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
});
