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

  it('should add @angular/cdk', async () => {
    tree.overwrite(
      'package.json',
      `{
  "dependencies": {},
  "devDependencies": {}
}`
    );

    const updatedTree = await runSchematic();

    const libraryPackageJson = JSON.parse(
      updatedTree.readContent('package.json')
    );

    expect(libraryPackageJson.dependencies['@angular/cdk']).toEqual('^13.0.0');
  });
});
