import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../testing/scaffold';

const COLLECTION_PATH = path.join(__dirname, '../../../collection.json');

async function setup(): Promise<{
  runSchematic: () => Promise<UnitTestTree>;
  tree: UnitTestTree;
}> {
  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

  const tree = await createTestApp(runner, {
    projectName: 'my-project',
  });

  return {
    runSchematic: (): Promise<UnitTestTree> =>
      runner.runSchematic('ng-add', {}, tree),
    tree,
  };
}

describe('ng-add.schematic', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add axe-core to devDependencies', async () => {
    const { runSchematic } = await setup();
    const updatedTree = await runSchematic();

    const packageJson = JSON.parse(updatedTree.readText('/package.json'));
    expect(packageJson.devDependencies['axe-core']).toBe('~4.11.1');
  });

  it('should throw if @skyux-sdk/testing is not installed', async () => {
    jest.mock('@skyux-sdk/testing/package.json', () => {
      throw new Error('Cannot find module');
    });

    const { runSchematic } = await setup();

    await expect(runSchematic()).rejects.toThrow(
      'Could not resolve @skyux-sdk/testing/package.json.',
    );
  });
});
