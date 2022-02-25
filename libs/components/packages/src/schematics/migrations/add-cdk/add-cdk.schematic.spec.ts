import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestLibrary } from '../../testing/scaffold';

describe('Migrations > Add cdk', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-lib';
  const schematicName = 'add-cdk';

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

  it('should add the cdk if a relevant package exists', async () => {
    tree.overwrite(
      'package.json',
      `{
  "peerDependencies": {
    "@angular/core": "^12.0.0"
  },
  "dependencies": {
    "@skyux/flyout": "5.0.0",
    "tslib": "^2.0.0"
  }
}`
    );

    const updatedTree = await runSchematic();

    const libraryPackageJson = JSON.parse(
      updatedTree.readContent('package.json')
    );

    expect(libraryPackageJson.dependencies['@angular/cdk']).toEqual('^12.0.0');
    expect(libraryPackageJson.dependencies['@skyux/flyout']).toEqual('5.0.0');
    expect(libraryPackageJson.dependencies.tslib).toEqual('^2.0.0');
  });

  it('should not add the cdk if no relevant package exists', async () => {
    tree.overwrite(
      'package.json',
      `{
  "peerDependencies": {
    "@angular/core": "^12.0.0"
  },
  "dependencies": {
    "moment": "1.0.0",
    "tslib": "^2.0.0"
  }
}`
    );

    const updatedTree = await runSchematic();

    const libraryPackageJson = JSON.parse(
      updatedTree.readContent('package.json')
    );

    expect(libraryPackageJson.dependencies['@angular/cdk']).toBeUndefined();
    expect(libraryPackageJson.dependencies.moment).toEqual('1.0.0');
    expect(libraryPackageJson.dependencies.tslib).toEqual('^2.0.0');
  });
});
