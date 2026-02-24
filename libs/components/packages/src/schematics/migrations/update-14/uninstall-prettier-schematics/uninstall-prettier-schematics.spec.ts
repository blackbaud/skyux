import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

const COLLECTION_PATH = path.join(__dirname, '../../../../../migrations.json');

const SCHEMATIC_NAME = 'uninstall-prettier-schematics';

async function setup(): Promise<{
  runSchematic: () => Promise<UnitTestTree>;
  tree: UnitTestTree;
}> {
  const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);

  const tree = await createTestApp(runner, {
    projectName: 'my-app',
  });

  return {
    runSchematic: () => runner.runSchematic(SCHEMATIC_NAME, {}, tree),
    tree,
  };
}

describe('uninstall-prettier-schematics', () => {
  it('should remove @skyux-sdk/prettier-schematics from package.json', async () => {
    const { runSchematic, tree } = await setup();

    const packageJson = JSON.parse(tree.readText('/package.json'));
    packageJson.devDependencies['@skyux-sdk/prettier-schematics'] = '1.0.0';
    tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

    const updatedTree = await runSchematic();

    const updatedPackageJson = JSON.parse(
      updatedTree.readText('/package.json'),
    );

    expect(
      updatedPackageJson.devDependencies['@skyux-sdk/prettier-schematics'],
    ).toBeUndefined();
  });

  it('should succeed if @skyux-sdk/prettier-schematics is not installed', async () => {
    const { runSchematic } = await setup();

    await expect(runSchematic()).resolves.toBeInstanceOf(UnitTestTree);
  });
});
