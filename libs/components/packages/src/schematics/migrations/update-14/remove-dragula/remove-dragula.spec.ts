import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';
import { JsonFile } from '../../../utility/json-file';

const COLLECTION_PATH = path.join(__dirname, '../../../../../migrations.json');
const SCHEMATIC_NAME = 'remove-dragula';

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

describe('remove-dragula', () => {
  it('should remove dom-autoscroller from package.json', async () => {
    const { runSchematic, tree } = await setup();

    new JsonFile(tree, '/package.json').modify(
      ['dependencies', 'dom-autoscroller'],
      '2.3.4',
    );

    const updatedTree = await runSchematic();

    expect(
      new JsonFile(updatedTree, '/package.json').get([
        'dependencies',
        'dom-autoscroller',
      ]),
    ).toBeUndefined();
  });

  describe('when ng2-dragula is not used', () => {
    it('should remove @types/dragula from package.json', async () => {
      const { runSchematic, tree } = await setup();

      new JsonFile(tree, '/package.json').modify(
        ['devDependencies', '@types/dragula'],
        '2.1.36',
      );

      const updatedTree = await runSchematic();

      expect(
        new JsonFile(updatedTree, '/package.json').get([
          'devDependencies',
          '@types/dragula',
        ]),
      ).toBeUndefined();
    });

    it('should remove dragula from package.json', async () => {
      const { runSchematic, tree } = await setup();

      new JsonFile(tree, '/package.json').modify(
        ['dependencies', 'dragula'],
        '3.7.3',
      );

      const updatedTree = await runSchematic();

      expect(
        new JsonFile(updatedTree, '/package.json').get([
          'dependencies',
          'dragula',
        ]),
      ).toBeUndefined();
    });

    it('should remove ng2-dragula from package.json', async () => {
      const { runSchematic, tree } = await setup();

      new JsonFile(tree, '/package.json').modify(
        ['dependencies', 'ng2-dragula'],
        '4.0.0',
      );

      const updatedTree = await runSchematic();

      expect(
        new JsonFile(updatedTree, '/package.json').get([
          'dependencies',
          'ng2-dragula',
        ]),
      ).toBeUndefined();
    });

    it('should remove ng2-dragula overrides from package.json', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = new JsonFile(tree, '/package.json');
      packageJson.modify(['overrides', 'ng2-dragula@5.1.0'], {
        '@angular/core': '>=21.0.0',
      });
      packageJson.modify(['overrides', 'other-package'], {
        dep: '1.0.0',
      });

      const updatedTree = await runSchematic();
      const updatedPackageJson = new JsonFile(updatedTree, '/package.json');

      expect(
        updatedPackageJson.get(['overrides', 'ng2-dragula@5.1.0']),
      ).toBeUndefined();
      expect(
        updatedPackageJson.get(['overrides', 'other-package']),
      ).toBeDefined();
    });

    it('should remove the overrides section if empty after removing ng2-dragula', async () => {
      const { runSchematic, tree } = await setup();

      new JsonFile(tree, '/package.json').modify(
        ['overrides', 'ng2-dragula@5.1.0'],
        {
          '@angular/core': '>=21.0.0',
        },
      );

      const updatedTree = await runSchematic();

      expect(
        new JsonFile(updatedTree, '/package.json').get(['overrides']),
      ).toBeUndefined();
    });

    it('should succeed if dragula packages are not installed', async () => {
      const { runSchematic } = await setup();

      await expect(runSchematic()).resolves.toBeInstanceOf(UnitTestTree);
    });
  });

  describe('when ng2-dragula is used', () => {
    it('should add dragula dependencies to package.json', async () => {
      const { runSchematic, tree } = await setup();

      tree.create(
        '/src/app/my-component.ts',
        `import { DragulaModule } from 'ng2-dragula';`,
      );

      const updatedTree = await runSchematic();
      const updatedPackageJson = new JsonFile(updatedTree, '/package.json');

      expect(
        updatedPackageJson.get(['devDependencies', '@types/dragula']),
      ).toBe('2.1.36');
      expect(updatedPackageJson.get(['dependencies', 'dragula'])).toBe('3.7.3');
      expect(updatedPackageJson.get(['dependencies', 'ng2-dragula'])).toBe(
        '5.1.0',
      );
    });

    it('should add ng2-dragula overrides to package.json', async () => {
      const { runSchematic, tree } = await setup();

      tree.create(
        '/src/app/my-component.ts',
        `import { DragulaModule } from 'ng2-dragula';`,
      );

      const updatedTree = await runSchematic();

      expect(
        new JsonFile(updatedTree, '/package.json').get([
          'overrides',
          'ng2-dragula@5.1.0',
        ]),
      ).toEqual({
        '@angular/animations': '>=21.0.0',
        '@angular/core': '>=21.0.0',
        '@angular/common': '>=21.0.0',
      });
    });

    it('should not overwrite existing dragula dependencies', async () => {
      const { runSchematic, tree } = await setup();

      tree.create(
        '/src/app/my-component.ts',
        `import { DragulaService } from 'ng2-dragula';`,
      );

      const packageJson = new JsonFile(tree, '/package.json');
      packageJson.modify(['dependencies', 'ng2-dragula'], '2.0.0');
      packageJson.modify(['dependencies', 'dragula'], '3.0.0');
      packageJson.modify(['devDependencies', '@types/dragula'], '2.0.0');

      const updatedTree = await runSchematic();
      const updatedPackageJson = new JsonFile(updatedTree, '/package.json');

      expect(updatedPackageJson.get(['dependencies', 'ng2-dragula'])).toBe(
        '2.0.0',
      );
      expect(updatedPackageJson.get(['dependencies', 'dragula'])).toBe('3.0.0');
      expect(
        updatedPackageJson.get(['devDependencies', '@types/dragula']),
      ).toBe('2.0.0');
    });

    it('should detect ng2-dragula usage via dynamic import', async () => {
      const { runSchematic, tree } = await setup();

      tree.create(
        '/src/app/my-component.ts',
        `const mod = import('ng2-dragula');`,
      );

      const updatedTree = await runSchematic();

      expect(
        new JsonFile(updatedTree, '/package.json').get([
          'dependencies',
          'ng2-dragula',
        ]),
      ).toBe('5.1.0');
    });

    it('should still remove dom-autoscroller', async () => {
      const { runSchematic, tree } = await setup();

      tree.create(
        '/src/app/my-component.ts',
        `import { DragulaModule } from 'ng2-dragula';`,
      );

      new JsonFile(tree, '/package.json').modify(
        ['dependencies', 'dom-autoscroller'],
        '2.3.4',
      );

      const updatedTree = await runSchematic();

      expect(
        new JsonFile(updatedTree, '/package.json').get([
          'dependencies',
          'dom-autoscroller',
        ]),
      ).toBeUndefined();
    });
  });
});
