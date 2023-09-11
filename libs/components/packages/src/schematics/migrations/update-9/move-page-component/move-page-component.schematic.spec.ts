import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { firstValueFrom } from 'rxjs';

import { createTestLibrary } from '../../../testing/scaffold';
import { getRequiredProject } from '../../../utility/workspace';
import { updateWorkspace } from '../../../utility/workspace';

describe('MovePageComponentSchematic', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../migration-collection.json')
  );

  async function setupTest(): Promise<{
    tree: UnitTestTree;
    project: ProjectDefinition;
    runner: SchematicTestRunner;
  }> {
    const tree = await createTestLibrary(runner, {
      projectName: 'test-lib',
    });
    const { project } = await getRequiredProject(tree, 'test-lib');

    return {
      tree,
      project,
      runner,
    };
  }

  it('should run successfully', async () => {
    const { tree, runner } = await setupTest();
    expect(() =>
      runner.runSchematic('move-page-component', {}, tree)
    ).not.toThrow();
  });

  it('should update single import', async () => {
    const { tree, project, runner } = await setupTest();
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/layout',
      version: '0.0.0',
    });
    tree.create(
      `${project.sourceRoot}/app/custom.module.ts`,
      stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyPageModule } from '@skyux/layout';

      @NgModule({
      imports: [SkyPageModule],
      })
      export class CustomModule {}
    `
    );
    const result = await runner.runSchematic('move-page-component', {}, tree);
    expect(result.readContent(`${project.sourceRoot}/app/custom.module.ts`))
      .toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { SkyPageModule } from '@skyux/pages';

      @NgModule({
      imports: [SkyPageModule],
      })
      export class CustomModule {}"
    `);
    expect(
      (result.readJson('package.json') as any).dependencies['@skyux/pages']
    ).toEqual('0.0.0');
  });

  it('should update multiple import', async () => {
    const { tree, project, runner } = await setupTest();
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/layout',
      version: '0.0.0',
    });
    tree.create(
      `${project.sourceRoot}/app/custom.module.ts`,
      stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyActionButtonPermalink, SkyPageModule } from '@skyux/layout';

      @NgModule({
      imports: [SkyPageModule],
      })
      export class CustomModule {}
    `
    );
    const result = await runner.runSchematic('move-page-component', {}, tree);
    expect(result.readContent(`${project.sourceRoot}/app/custom.module.ts`))
      .toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { SkyActionButtonPermalink } from '@skyux/layout';
      import { SkyPageModule } from '@skyux/pages';

      @NgModule({
      imports: [SkyPageModule],
      })
      export class CustomModule {}"
    `);
  });

  it('should update multiple import, first item', async () => {
    const { tree, project, runner } = await setupTest();
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/layout',
      version: '0.0.0',
    });
    tree.create(
      `${project.sourceRoot}/app/custom.module.ts`,
      stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyPageModule, SkyTextExpandRepeaterListStyleType } from '@skyux/layout';

      @NgModule({
      imports: [SkyPageModule],
      })
      export class CustomModule {}
    `
    );

    // One update where sourceRoot is undefined.
    const workspaceUpdate = updateWorkspace((workspace) => {
      workspace.projects.set('test-lib', {
        ...(workspace.projects.get('test-lib') as ProjectDefinition),
        sourceRoot: undefined,
      });
    });
    const updatedTree = await firstValueFrom(
      runner.callRule(workspaceUpdate, tree)
    );

    const result = await runner.runSchematic(
      'move-page-component',
      {},
      updatedTree
    );
    expect(result.readContent(`${project.sourceRoot}/app/custom.module.ts`))
      .toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { SkyTextExpandRepeaterListStyleType } from '@skyux/layout';
      import { SkyPageModule } from '@skyux/pages';

      @NgModule({
      imports: [SkyPageModule],
      })
      export class CustomModule {}"
    `);
  });

  it('should update multiple import, multi-line', async () => {
    const { tree, project, runner } = await setupTest();
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/layout',
      version: '0.0.0',
    });
    tree.create(
      `${project.sourceRoot}/app/custom.module.ts`,
      stripIndents`
      import { NgModule } from '@angular/core';
      import {
      SkyActionButtonPermalink,
      SkyPageModule,
      SkyTextExpandRepeaterListStyleType,
      } from '@skyux/layout';

      @NgModule({
      imports: [SkyPageModule],
      })
      export class CustomModule {}
    `
    );

    // One update where sourceRoot is undefined.
    const workspaceUpdate = updateWorkspace((workspace) => {
      workspace.projects.set('test-lib', {
        ...(workspace.projects.get('test-lib') as ProjectDefinition),
        sourceRoot: undefined,
      });
    });
    const updatedTree = await firstValueFrom(
      runner.callRule(workspaceUpdate, tree)
    );

    const result = await runner.runSchematic(
      'move-page-component',
      {},
      updatedTree
    );
    expect(result.readContent(`${project.sourceRoot}/app/custom.module.ts`))
      .toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import {
      SkyActionButtonPermalink,
      SkyTextExpandRepeaterListStyleType,
      } from '@skyux/layout';
      import { SkyPageModule } from '@skyux/pages';

      @NgModule({
      imports: [SkyPageModule],
      })
      export class CustomModule {}"
    `);
  });

  it('should update existing import', async () => {
    const { tree, project, runner } = await setupTest();
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/layout',
      version: '0.0.0',
    });
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/pages',
      version: '0.0.0',
    });
    tree.create(
      `${project.sourceRoot}/app/custom.module.ts`,
      stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyPageModule } from '@skyux/layout';
      import { SkyPageLink } from '@skyux/pages';

      @NgModule({
      imports: [SkyPageModule],
      })
      export class CustomModule {}
    `
    );
    const result = await runner.runSchematic('move-page-component', {}, tree);
    expect(result.readContent(`${project.sourceRoot}/app/custom.module.ts`))
      .toMatchInlineSnapshot(`
      "import { NgModule } from '@angular/core';
      import { SkyPageLink, SkyPageModule } from '@skyux/pages';

      @NgModule({
      imports: [SkyPageModule],
      })
      export class CustomModule {}"
    `);
  });

  it('should update <sky-page layout="auto">', async () => {
    const { tree, project, runner } = await setupTest();
    tree.create(
      `${project.sourceRoot}/app/custom.component.html`,
      stripIndents`
        <sky-page layout="auto">
        <sky-page-header>
        Example...
        </sky-page-header>
        </sky-page>
      `
    );
    const result = await runner.runSchematic('move-page-component', {}, tree);
    expect(result.readText(`${project.sourceRoot}/app/custom.component.html`))
      .toMatchInlineSnapshot(`
      "<sky-page>
      <sky-page-header>
      Example...
      </sky-page-header>
      </sky-page>"
      `);
  });

  it('should not update other <sky-page layout>', async () => {
    const { tree, project, runner } = await setupTest();
    tree.create(
      `${project.sourceRoot}/app/custom.component.html`,
      stripIndents`
        <sky-page layout="fit">
        <sky-page-header>
        Example...
        </sky-page-header>
        </sky-page>
      `
    );
    const result = await runner.runSchematic('move-page-component', {}, tree);
    expect(result.readText(`${project.sourceRoot}/app/custom.component.html`))
      .toMatchInlineSnapshot(`
      "<sky-page layout="fit">
      <sky-page-header>
      Example...
      </sky-page-header>
      </sky-page>"
      `);
  });
});
