import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

describe('remove-nx-cache.schematic', () => {
  it('should run successfully', async () => {
    const collectionPath = require.resolve('../../migration-collection.json');
    jest.mock('child_process', () => ({
      execSync: jest.fn(),
    }));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = new UnitTestTree(Tree.empty());
    tree.create('.gitignore', '');
    tree.create('package.json', '{}');
    await runner.runSchematic('remove-nx-cache', {}, tree);
    expect(tree.readText('.gitignore')).toContain('/.nx');
  });
});
