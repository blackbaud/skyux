import { normalize } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { createTestLibrary } from '../testing/scaffold';

const COLLECTION_PATH = normalize(`${__dirname}/../../../collection.json`);

describe('ng-add.schematic', () => {
  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  runner.logger.subscribe((entry) => console.log(entry.message));
  const defaultProjectName = 'my-lib';

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestLibrary(runner, {
      projectName: defaultProjectName,
    });
  });

  function runSchematic(
    options: { project?: string } = {}
  ): Promise<UnitTestTree> {
    return runner.runSchematic('ng-add', options, tree);
  }

  it('should install @angular/cdk', async () => {
    const updatedTree = await runSchematic();

    const packageJson = JSON.parse(updatedTree.readContent('package.json'));

    expect(packageJson.dependencies['@angular/cdk']).toBeDefined();
  });

  it('should install essential SKY UX packages', async () => {
    const updatedTree = await runSchematic();

    const packageJson = JSON.parse(updatedTree.readContent('package.json'));

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
    const updatedTree = await runSchematic();

    const angularJson = JSON.parse(updatedTree.readContent('angular.json'));

    expect(
      angularJson.projects['my-lib-showcase'].architect.build.options.styles
    ).toEqual([
      'node_modules/@skyux/theme/css/sky.css',
      'node_modules/@skyux/theme/css/themes/modern/styles.css',
      'projects/my-lib-showcase/src/styles.css',
    ]);
  });

  it('should add @skyux/packages/polyfills', async () => {
    const updatedTree = await runSchematic();

    const angularJson = JSON.parse(updatedTree.readContent('angular.json'));

    expect(
      angularJson.projects['my-lib-showcase'].architect.build.options.polyfills
    ).toEqual(['zone.js', '@skyux/packages/polyfills']);
  });
});
