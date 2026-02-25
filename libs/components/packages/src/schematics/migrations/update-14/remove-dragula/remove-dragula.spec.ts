import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

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

function readPackageJson(tree: UnitTestTree): Record<string, unknown> {
  return JSON.parse(tree.readText('/package.json'));
}

function writePackageJson(
  tree: UnitTestTree,
  packageJson: Record<string, unknown>,
): void {
  tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));
}

describe('remove-dragula', () => {
  it('should remove dom-autoscroller from package.json', async () => {
    const { runSchematic, tree } = await setup();

    const packageJson = readPackageJson(tree);
    (packageJson['dependencies'] as Record<string, string>)[
      'dom-autoscroller'
    ] = '2.3.4';
    writePackageJson(tree, packageJson);

    const updatedTree = await runSchematic();
    const updatedPackageJson = readPackageJson(updatedTree);

    expect(
      (updatedPackageJson['dependencies'] as Record<string, string>)[
        'dom-autoscroller'
      ],
    ).toBeUndefined();
  });

  describe('when ng2-dragula is not used', () => {
    it('should remove @types/dragula from package.json', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = readPackageJson(tree);
      (packageJson['devDependencies'] as Record<string, string>)[
        '@types/dragula'
      ] = '2.1.36';
      writePackageJson(tree, packageJson);

      const updatedTree = await runSchematic();
      const updatedPackageJson = readPackageJson(updatedTree);

      expect(
        (updatedPackageJson['devDependencies'] as Record<string, string>)[
          '@types/dragula'
        ],
      ).toBeUndefined();
    });

    it('should remove dragula from package.json', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = readPackageJson(tree);
      (packageJson['dependencies'] as Record<string, string>)['dragula'] =
        '3.7.3';
      writePackageJson(tree, packageJson);

      const updatedTree = await runSchematic();
      const updatedPackageJson = readPackageJson(updatedTree);

      expect(
        (updatedPackageJson['dependencies'] as Record<string, string>)[
          'dragula'
        ],
      ).toBeUndefined();
    });

    it('should remove ng2-dragula from package.json', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = readPackageJson(tree);
      (packageJson['dependencies'] as Record<string, string>)['ng2-dragula'] =
        '4.0.0';
      writePackageJson(tree, packageJson);

      const updatedTree = await runSchematic();
      const updatedPackageJson = readPackageJson(updatedTree);

      expect(
        (updatedPackageJson['dependencies'] as Record<string, string>)[
          'ng2-dragula'
        ],
      ).toBeUndefined();
    });

    it('should remove ng2-dragula overrides from package.json', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = readPackageJson(tree);
      packageJson['overrides'] = {
        'ng2-dragula@5.1.0': {
          '@angular/core': '>=21.0.0',
        },
        'other-package': {
          dep: '1.0.0',
        },
      };
      writePackageJson(tree, packageJson);

      const updatedTree = await runSchematic();
      const updatedPackageJson = readPackageJson(updatedTree);

      const overrides = updatedPackageJson['overrides'] as Record<
        string,
        unknown
      >;

      expect(overrides['ng2-dragula@5.1.0']).toBeUndefined();
      expect(overrides['other-package']).toBeDefined();
    });

    it('should remove the overrides section if empty after removing ng2-dragula', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = readPackageJson(tree);
      packageJson['overrides'] = {
        'ng2-dragula@5.1.0': {
          '@angular/core': '>=21.0.0',
        },
      };
      writePackageJson(tree, packageJson);

      const updatedTree = await runSchematic();
      const updatedPackageJson = readPackageJson(updatedTree);

      expect(updatedPackageJson['overrides']).toBeUndefined();
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
      const updatedPackageJson = readPackageJson(updatedTree);

      const deps = updatedPackageJson['dependencies'] as Record<string, string>;
      const devDeps = updatedPackageJson['devDependencies'] as Record<
        string,
        string
      >;

      expect(devDeps['@types/dragula']).toBe('2.1.36');
      expect(deps['dragula']).toBe('3.7.3');
      expect(deps['ng2-dragula']).toBe('5.1.0');
    });

    it('should add ng2-dragula overrides to package.json', async () => {
      const { runSchematic, tree } = await setup();

      tree.create(
        '/src/app/my-component.ts',
        `import { DragulaModule } from 'ng2-dragula';`,
      );

      const updatedTree = await runSchematic();
      const updatedPackageJson = readPackageJson(updatedTree);

      const overrides = updatedPackageJson['overrides'] as Record<
        string,
        unknown
      >;

      expect(overrides['ng2-dragula@5.1.0']).toEqual({
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

      const packageJson = readPackageJson(tree);
      (packageJson['dependencies'] as Record<string, string>)['ng2-dragula'] =
        '2.0.0';
      (packageJson['dependencies'] as Record<string, string>)['dragula'] =
        '3.0.0';
      (packageJson['devDependencies'] as Record<string, string>)[
        '@types/dragula'
      ] = '2.0.0';
      writePackageJson(tree, packageJson);

      const updatedTree = await runSchematic();
      const updatedPackageJson = readPackageJson(updatedTree);

      const deps = updatedPackageJson['dependencies'] as Record<string, string>;
      const devDeps = updatedPackageJson['devDependencies'] as Record<
        string,
        string
      >;

      expect(deps['ng2-dragula']).toBe('2.0.0');
      expect(deps['dragula']).toBe('3.0.0');
      expect(devDeps['@types/dragula']).toBe('2.0.0');
    });

    it('should detect ng2-dragula usage via dynamic import', async () => {
      const { runSchematic, tree } = await setup();

      tree.create(
        '/src/app/my-component.ts',
        `const mod = import('ng2-dragula');`,
      );

      const updatedTree = await runSchematic();
      const updatedPackageJson = readPackageJson(updatedTree);

      const deps = updatedPackageJson['dependencies'] as Record<string, string>;

      expect(deps['ng2-dragula']).toBe('5.1.0');
    });

    it('should still remove dom-autoscroller', async () => {
      const { runSchematic, tree } = await setup();

      tree.create(
        '/src/app/my-component.ts',
        `import { DragulaModule } from 'ng2-dragula';`,
      );

      const packageJson = readPackageJson(tree);
      (packageJson['dependencies'] as Record<string, string>)[
        'dom-autoscroller'
      ] = '2.3.4';
      writePackageJson(tree, packageJson);

      const updatedTree = await runSchematic();
      const updatedPackageJson = readPackageJson(updatedTree);

      expect(
        (updatedPackageJson['dependencies'] as Record<string, string>)[
          'dom-autoscroller'
        ],
      ).toBeUndefined();
    });
  });
});
