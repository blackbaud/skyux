import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import fs from 'node:fs';
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

    const originalReadFileSync = fs.readFileSync;
    jest.spyOn(fs, 'readFileSync').mockImplementation((...args) => {
      if (typeof args[0] === 'string' && args[0].endsWith('package.json')) {
        return JSON.stringify({
          'ng-update': {
            packageGroup: {
              'axe-core': '~4.11.1',
            },
          },
        });
      }
      return originalReadFileSync(...args);
    });

    const updatedTree = await runSchematic();

    const packageJson = JSON.parse(updatedTree.readText('/package.json'));
    expect(packageJson.devDependencies['axe-core']).toBe('~4.11.1');
  });
});
