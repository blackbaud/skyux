import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp, createTestLibrary } from '../../testing/scaffold';

describe('Migrations > Ensure SKY UX Theme stylesheets', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-app';
  const schematicName = 'ensure-theme-stylesheets';

  const runner = new SchematicTestRunner('migrations', collectionPath);

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestApp(runner, {
      defaultProjectName,
    });
  });

  function runSchematic(): Promise<UnitTestTree> {
    return runner.runSchematicAsync(schematicName, {}, tree).toPromise();
  }

  it('should add SKY UX theme stylesheets', async () => {
    const updatedTree = await runSchematic();

    const angularJson = JSON.parse(updatedTree.readContent('angular.json'));

    expect(
      angularJson.projects[defaultProjectName].architect.build.options.styles
    ).toEqual([
      'node_modules/@skyux/theme/css/sky.css',
      'node_modules/@skyux/theme/css/themes/modern/styles.css',
      'src/styles.scss',
    ]);

    expect(
      angularJson.projects[defaultProjectName].architect.test.options.styles
    ).toEqual([
      'node_modules/@skyux/theme/css/sky.css',
      'node_modules/@skyux/theme/css/themes/modern/styles.css',
      'src/styles.scss',
    ]);
  });

  it('should add SKY UX theme stylesheets to showcase app', async () => {
    tree = await createTestLibrary(runner, { name: 'my-lib' });

    const updatedTree = await runSchematic();

    const angularJson = JSON.parse(updatedTree.readContent('angular.json'));

    expect(
      angularJson.projects['my-lib-showcase'].architect.build.options.styles
    ).toEqual([
      'node_modules/@skyux/theme/css/sky.css',
      'node_modules/@skyux/theme/css/themes/modern/styles.css',
      'projects/my-lib-showcase/src/styles.css',
    ]);

    expect(
      angularJson.projects['my-lib'].architect.test.options.styles
    ).toEqual([
      'node_modules/@skyux/theme/css/sky.css',
      'node_modules/@skyux/theme/css/themes/modern/styles.css',
    ]);
  });
});
