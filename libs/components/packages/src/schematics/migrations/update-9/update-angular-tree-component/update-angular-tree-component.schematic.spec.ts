import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../../testing/scaffold';

describe('Migrations > Update angular-tree-component dependency', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    join(__dirname, '../../migration-collection.json')
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });

    return {
      runSchematic: () =>
        runner.runSchematic('update-angular-tree-component', {}, tree),
      tree,
    };
  }

  it('should update the dependency if @skyux/angular-tree-component and @circlon/angular-tree-component installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"dependencies": {"@skyux/angular-tree-component": "8.0.0", "@circlon/angular-tree-component": "11.0.4"}}'
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@skyux/angular-tree-component': '8.0.0',
        '@blackbaud/angular-tree-component': '1.0.0-alpha.0',
      },
    });
  });

  it('should not update the dependency if @skyux/angular-tree-component is not installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/package.json',
      '{"dependencies": {"@circlon/angular-tree-component": "11.0.4"}}'
    );

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({
      dependencies: {
        '@circlon/angular-tree-component': '11.0.4',
      },
    });
  });

  it('should add @blackbaud/angular-tree-component if @skyux/angular-tree-component is not installed', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite('/package.json', '{}');

    await runSchematic();

    expect(tree.readJson('/package.json')).toEqual({});
  });

  it('should replace @circlon/angular-tree-component import paths', async () => {
    const { runSchematic, tree } = await setupTest();

    tree.overwrite(
      '/src/app/app.component.ts',
      `
      import { Foobar } from '@circlon/angular-tree-component';
      import { FooBarBaz } from '@circlon/angular-tree-component/foo/bar/baz';
      import {
        FooService,
        BarService
      } from '@circlon/angular-tree-component';
      `
    );

    await runSchematic();

    expect(tree.readText('/src/app/app.component.ts')).toEqual(`
      import { Foobar } from '@blackbaud/angular-tree-component';
      import { FooBarBaz } from '@blackbaud/angular-tree-component/foo/bar/baz';
      import {
        FooService,
        BarService
      } from '@blackbaud/angular-tree-component';
      `);
  });
});
