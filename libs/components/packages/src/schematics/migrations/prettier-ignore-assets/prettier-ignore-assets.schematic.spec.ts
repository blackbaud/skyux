import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('Migrations > Add assets folder to Prettier ignore', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-app';
  const schematicName = 'prettier-ignore-assets';

  const expectedContents = `src/assets
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

  it('should add Angular cache to .prettierignore', async () => {
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

  it('should not update .prettierignore if assets path already added', async () => {
    tree.create('.prettierignore', expectedContents);

    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('.prettierignore')).toEqual(
      expectedContents
    );
  });

  it('should not update .prettierignore if assets path already added in a different format', async () => {
    const originalContents = `/.angular/cache
\\src\\assets
coverage
dist
node_modules
package-lock.json
    `;

    tree.create('.prettierignore', originalContents);
    const updatedTree = await runSchematic();

    expect(updatedTree.readContent('.prettierignore')).toEqual(
      originalContents
    );
  });
});
