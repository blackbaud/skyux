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

describe('remove-dragula', () => {
  it('should remove dragula packages when not used', async () => {
    const { runSchematic, tree } = await setup();

    const packageJson = JSON.parse(tree.readText('/package.json'));
    packageJson.dependencies['dragula'] = '1.0.0';
    packageJson.dependencies['ng2-dragula'] = '2.0.0';
    packageJson.dependencies['dom-autoscroller'] = '3.0.0';
    tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

    const updatedTree = await runSchematic();

    const updatedPackageJson = JSON.parse(
      updatedTree.readText('/package.json'),
    );

    expect(updatedPackageJson.dependencies['dragula']).toBeUndefined();
    expect(updatedPackageJson.dependencies['ng2-dragula']).toBeUndefined();
    expect(updatedPackageJson.dependencies['dom-autoscroller']).toBeUndefined();
  });

  it('should keep dragula package if it is being used', async () => {
    const { runSchematic, tree } = await setup();

    const packageJson = JSON.parse(tree.readText('/package.json'));
    packageJson.dependencies['dragula'] = '1.0.0';
    packageJson.dependencies['ng2-dragula'] = '2.0.0';
    tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

    // Create a file that imports dragula
    tree.create(
      '/src/app/dragula.component.ts',
      `import { Component } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-dragula',
  template: '<div></div>',
})
export class DragulaComponent {
  constructor(private dragulaService: DragulaService) {}
}`,
    );

    const updatedTree = await runSchematic();

    const updatedPackageJson = JSON.parse(
      updatedTree.readText('/package.json'),
    );

    expect(updatedPackageJson.dependencies['dragula']).toBeUndefined();
    expect(updatedPackageJson.dependencies['ng2-dragula']).toBe('2.0.0');
  });

  it('should keep dom-autoscroller if it is being used', async () => {
    const { runSchematic, tree } = await setup();

    const packageJson = JSON.parse(tree.readText('/package.json'));
    packageJson.dependencies['dom-autoscroller'] = '3.0.0';
    tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

    // Create a file that imports dom-autoscroller
    tree.create(
      '/src/app/autoscroller.component.ts',
      `import { Component } from '@angular/core';
import autoScroll from 'dom-autoscroller';

@Component({
  selector: 'app-autoscroller',
  template: '<div></div>',
})
export class AutoscrollerComponent {
  ngOnInit() {
    autoScroll([document.querySelector('.container')]);
  }
}`,
    );

    const updatedTree = await runSchematic();

    const updatedPackageJson = JSON.parse(
      updatedTree.readText('/package.json'),
    );

    expect(updatedPackageJson.dependencies['dom-autoscroller']).toBe('3.0.0');
  });

  it('should succeed if dragula packages are not installed', async () => {
    const { runSchematic } = await setup();

    await expect(runSchematic()).resolves.toBeInstanceOf(UnitTestTree);
  });

  describe('ng2-dragula overrides', () => {
    it('should remove ng2-dragula override when package is removed', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = JSON.parse(tree.readText('/package.json'));
      packageJson.dependencies['ng2-dragula'] = '2.0.0';
      packageJson.overrides = {
        'ng2-dragula@2.0.0': {
          '@angular/animations': '>=21.0.0',
          '@angular/core': '>=21.0.0',
          '@angular/common': '>=21.0.0',
        },
      };
      tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

      const updatedTree = await runSchematic();

      const updatedPackageJson = JSON.parse(
        updatedTree.readText('/package.json'),
      );

      expect(updatedPackageJson.dependencies['ng2-dragula']).toBeUndefined();
      expect(updatedPackageJson.overrides).toBeUndefined();
    });

    it('should remove ng2-dragula override without version', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = JSON.parse(tree.readText('/package.json'));
      packageJson.dependencies['ng2-dragula'] = '2.0.0';
      packageJson.overrides = {
        'ng2-dragula': {
          '@angular/core': '>=21.0.0',
        },
      };
      tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

      const updatedTree = await runSchematic();

      const updatedPackageJson = JSON.parse(
        updatedTree.readText('/package.json'),
      );

      expect(updatedPackageJson.dependencies['ng2-dragula']).toBeUndefined();
      expect(updatedPackageJson.overrides).toBeUndefined();
    });

    it('should keep overrides section when other packages have overrides', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = JSON.parse(tree.readText('/package.json'));
      packageJson.dependencies['ng2-dragula'] = '2.0.0';
      packageJson.overrides = {
        'ng2-dragula@2.0.0': {
          '@angular/core': '>=21.0.0',
        },
        'other-package@1.0.0': {
          '@angular/common': '>=21.0.0',
        },
      };
      tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

      const updatedTree = await runSchematic();

      const updatedPackageJson = JSON.parse(
        updatedTree.readText('/package.json'),
      );

      expect(updatedPackageJson.dependencies['ng2-dragula']).toBeUndefined();
      expect(updatedPackageJson.overrides).toBeDefined();
      expect(updatedPackageJson.overrides['ng2-dragula@2.0.0']).toBeUndefined();
      expect(updatedPackageJson.overrides['other-package@1.0.0']).toBeDefined();
    });

    it('should keep ng2-dragula override when package is still in use', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = JSON.parse(tree.readText('/package.json'));
      packageJson.dependencies['ng2-dragula'] = '2.0.0';
      packageJson.overrides = {
        'ng2-dragula@2.0.0': {
          '@angular/core': '>=21.0.0',
        },
      };
      tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

      // Create a file that imports ng2-dragula
      tree.create(
        '/src/app/dragula.component.ts',
        `import { DragulaService } from 'ng2-dragula';`,
      );

      const updatedTree = await runSchematic();

      const updatedPackageJson = JSON.parse(
        updatedTree.readText('/package.json'),
      );

      expect(updatedPackageJson.dependencies['ng2-dragula']).toBe('2.0.0');
      expect(updatedPackageJson.overrides['ng2-dragula@2.0.0']).toBeDefined();
    });

    it('should not fail when package.json has no overrides', async () => {
      const { runSchematic, tree } = await setup();

      const packageJson = JSON.parse(tree.readText('/package.json'));
      packageJson.dependencies['ng2-dragula'] = '2.0.0';
      tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));

      await expect(runSchematic()).resolves.toBeInstanceOf(UnitTestTree);
    });
  });
});
