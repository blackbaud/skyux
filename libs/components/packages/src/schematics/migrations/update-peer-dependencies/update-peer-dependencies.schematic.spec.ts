import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestLibrary } from '../../testing/scaffold';

describe('Migrations > Update peer dependencies', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-lib';
  const schematicName = 'update-peer-dependencies';

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

  it('should update library peer dependencies', async () => {
    tree.overwrite(
      'projects/my-lib/package.json',
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

    tree.overwrite(
      'package.json',
      `{
  "dependencies": {
    "@angular/core": "12.2.5",
    "moment": "1.2.3",
    "tslib": "2.5.0"
  }
}`
    );

    const updatedTree = await runSchematic();

    const libraryPackageJson = JSON.parse(
      updatedTree.readContent('projects/my-lib/package.json')
    );

    expect(libraryPackageJson.peerDependencies['@angular/core']).toEqual(
      '^12.2.5'
    );
    expect(libraryPackageJson.dependencies.moment).toEqual('1.2.3');
    expect(libraryPackageJson.dependencies.tslib).toEqual('^2.5.0');
  });

  it('should skip dependencies if they are not specific versions', async () => {
    tree.overwrite(
      'projects/my-lib/package.json',
      `{
  "peerDependencies": {
    "@angular/core": "^12.0.0"
  }
}`
    );

    tree.overwrite(
      'package.json',
      `{
  "dependencies": {
    "@angular/core": "~12.2.5"
  }
}`
    );

    const updatedTree = await runSchematic();

    const libraryPackageJson = JSON.parse(
      updatedTree.readContent('projects/my-lib/package.json')
    );

    expect(libraryPackageJson.peerDependencies['@angular/core']).toEqual(
      '^12.0.0' // <-- Should be unchanged since it was skipped.
    );
  });
});
