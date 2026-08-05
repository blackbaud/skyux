import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

describe('Migrations > Replace alert module', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
  );

  async function setup(): Promise<{
    runSchematic: () => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });

    return {
      runSchematic: (): Promise<UnitTestTree> =>
        runner.runSchematic('replace-alert-module', {}, tree),
      tree,
    };
  }

  it('should replace SkyAlertModule with SkyAlert', async () => {
    const { runSchematic, tree } = await setup();

    const filePath = '/src/app/example.component.ts';

    tree.create(
      filePath,
      stripIndents`
      import { Component } from '@angular/core';
      import { SkyAlertModule } from '@skyux/indicators';

      @Component({
        selector: 'app-example',
        imports: [SkyAlertModule],
        template: \`<sky-alert alertType="warning">Example</sky-alert>\`,
      })
      export class ExampleComponent {}`,
    );

    await runSchematic();

    expect(tree.readText(filePath)).toBe(stripIndents`
      import { Component } from '@angular/core';
      import { SkyAlert } from '@skyux/indicators';

      @Component({
        selector: 'app-example',
        imports: [SkyAlert],
        template: \`<sky-alert alertType="warning">Example</sky-alert>\`,
      })
      export class ExampleComponent {}`);
  });

  it('should replace SkyAlertModule in NgModule imports', async () => {
    const { runSchematic, tree } = await setup();

    const filePath = '/src/app/example.module.ts';

    tree.create(
      filePath,
      stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyAlertModule, SkyKeyInfoModule } from '@skyux/indicators';

      @NgModule({
        imports: [SkyAlertModule, SkyKeyInfoModule],
        exports: [SkyAlertModule, SkyKeyInfoModule],
      })
      export class ExampleModule {}`,
    );

    await runSchematic();

    expect(tree.readText(filePath)).toBe(stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyAlert, SkyKeyInfoModule } from '@skyux/indicators';

      @NgModule({
        imports: [SkyAlert, SkyKeyInfoModule],
        exports: [SkyAlert, SkyKeyInfoModule],
      })
      export class ExampleModule {}`);
  });

  it('should not modify SkyAlertModule imported from another package', async () => {
    const { runSchematic, tree } = await setup();

    const filePath = '/src/app/example.module.ts';
    const content = stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyAlertModule } from 'other-package';

      @NgModule({
        imports: [SkyAlertModule],
      })
      export class ExampleModule {}`;

    tree.create(filePath, content);

    await runSchematic();

    expect(tree.readText(filePath)).toBe(content);
  });

  it('should not modify files without SkyAlertModule', async () => {
    const { runSchematic, tree } = await setup();

    const filePath = '/src/app/example.module.ts';
    const content = stripIndents`
      import { NgModule } from '@angular/core';

      @NgModule({})
      export class ExampleModule {}`;

    tree.create(filePath, content);

    await runSchematic();

    expect(tree.readText(filePath)).toBe(content);
  });

  it('should ignore non-TypeScript files', async () => {
    const { runSchematic, tree } = await setup();

    const filePath = '/src/app/example.component.html';
    const content = '<p>SkyAlertModule</p>';

    tree.create(filePath, content);

    await runSchematic();

    expect(tree.readText(filePath)).toBe(content);
  });
});
