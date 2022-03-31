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

  it('should add the cdk if a relevant package installed', async () => {
    tree.overwrite(
      'package.json',
      `{
  "dependencies": {
    "@skyux/flyout": "5.0.0"
  },
  "devDependencies": {}
}`
    );

    const updatedTree = await runSchematic();

    const libraryPackageJson = JSON.parse(
      updatedTree.readContent('package.json')
    );

    expect(libraryPackageJson.dependencies['@angular/cdk']).toEqual('^13.0.0');
  });

  it('should not add the cdk if relevant package not installed', async () => {
    tree.overwrite(
      'package.json',
      `{
}`
    );

    const updatedTree = await runSchematic();

    const packageJson = JSON.parse(updatedTree.readContent('package.json'));

    expect(
      packageJson.dependencies && packageJson.dependencies['@angular/cdk']
    ).toBeUndefined();
  });
});
