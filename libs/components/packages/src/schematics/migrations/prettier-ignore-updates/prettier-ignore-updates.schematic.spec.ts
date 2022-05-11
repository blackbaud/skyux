import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Add assets folders to Prettier ignore', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-app';
  const schematicName = 'prettier-ignore-updates';

  let expectedContents = `/src/app/lib
/projects/*/src/assets
/src/assets
/.angular/cache
coverage
dist
node_modules
package-lock.json
`;

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

  it('should add new items to .prettierignore', async () => {
    tree.create(
      '.prettierignore',
      `/.angular/cache
coverage
dist
node_modules
package-lock.json
`
    );

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('.prettierignore')).toEqual(
      expectedContents
    );
  });

  it('should add SPA assets folder if other items already exists within .prettierignore', async () => {
    expectedContents = `/src/assets
/projects/*/src/assets
/src/app/lib
/.angular/cache
coverage
dist
node_modules
package-lock.json`;

    tree.create(
      '.prettierignore',
      `/projects/*/src/assets
/src/app/lib
/.angular/cache
coverage
dist
node_modules
package-lock.json`
    );

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('.prettierignore')).toEqual(
      expectedContents
    );
  });

  it('should add library assets folder if other items already exists within .prettierignore', async () => {
    expectedContents = `/projects/*/src/assets
/src/assets
/src/app/lib
/.angular/cache
coverage
dist
node_modules
package-lock.json`;

    tree.create(
      '.prettierignore',
      `/src/assets
/src/app/lib
/.angular/cache
coverage
dist
node_modules
package-lock.json`
    );

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('.prettierignore')).toEqual(
      expectedContents
    );
  });

  it('should add SPA library folder if other items already exists within .prettierignore', async () => {
    expectedContents = `/src/app/lib
/projects/*/src/assets
/src/assets
/.angular/cache
coverage
dist
node_modules
package-lock.json`;

    tree.create(
      '.prettierignore',
      `/projects/*/src/assets
/src/assets
/.angular/cache
coverage
dist
node_modules
package-lock.json`
    );

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('.prettierignore')).toEqual(
      expectedContents
    );
  });

  it('should not update .prettierignore if new paths already added', async () => {
    tree.create('.prettierignore', expectedContents);

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('.prettierignore')).toEqual(
      expectedContents
    );
  });
});
