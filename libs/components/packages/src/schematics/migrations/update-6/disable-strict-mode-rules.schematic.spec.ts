import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp } from '../../testing/scaffold';
import { JsonFile } from '../../utility/json-file';

describe('Migrations > Disable strictNullChecks', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-app';
  const schematicName = 'disable-strict-mode-rules';

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

  it('should disable strictNullChecks if strict mode is enabled', async () => {
    const tsConfig = new JsonFile(tree, 'tsconfig.json');
    tsConfig.modify(['compilerOptions', 'strict'], true);

    const updatedTree = await runSchematic();

    const updatedTsConfig = new JsonFile(updatedTree, 'tsconfig.json');

    expect(
      updatedTsConfig.get(['compilerOptions', 'strictNullChecks'])
    ).toEqual(false);
  });

  it('should ignore if strictNullChecks already set to false', async () => {
    const tsConfig = new JsonFile(tree, 'tsconfig.json');
    tsConfig.modify(['compilerOptions', 'strict'], true);
    tsConfig.modify(['compilerOptions', 'strictNullChecks'], false);

    const updatedTree = await runSchematic();

    const updatedTsConfig = updatedTree.readContent('tsconfig.json');

    expect(updatedTsConfig.includes('TODO: Remove "strictNullChecks"')).toEqual(
      false
    );
  });
});
