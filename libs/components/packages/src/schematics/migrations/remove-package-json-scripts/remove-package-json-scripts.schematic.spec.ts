import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestLibrary } from '../../testing/scaffold';

describe('Migrations > Remove package.json scripts', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-lib';
  const schematicName = 'remove-package-json-scripts';

  const runner = new SchematicTestRunner('migrations', collectionPath);

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });
  });

  function runSchematic(name?: string): Promise<UnitTestTree> {
    return runner
      .runSchematicAsync(
        schematicName,
        {
          defaultProjectName: name || defaultProjectName,
        },
        tree
      )
      .toPromise();
  }

  it('should setup testing module for code coverage', async () => {
    const packageJson = JSON.parse(tree.readContent('package.json'));
    packageJson.scripts = {
      'skyux:update-angular':
        'ng update @angular/core @angular/cli --force --allow-dirty',
      'skyux:update-skyux':
        'ng update @skyux/packages@next --force --allow-dirty',
      'skyux:update':
        'npm run skyux:update-angular && npm run skyux:update-skyux',
    };
    tree.overwrite('package.json', JSON.stringify(packageJson));

    const updatedTree = await runSchematic();
    const updatedPackageJson = JSON.parse(
      updatedTree.readContent('package.json')
    );
    expect(updatedPackageJson.scripts).toEqual({});
  });
});
