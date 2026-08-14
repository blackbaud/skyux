import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import path from 'node:path';

describe('legacy-i18n-services.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
  );

  function setupTree(files: Record<string, string>): Tree {
    const tree = Tree.empty();
    tree.create(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          app: {
            projectType: 'application',
            root: '',
            architect: {},
          },
          lib: {
            projectType: 'library',
            root: 'projects/lib',
            sourceRoot: 'projects/lib/src',
            architect: {},
          },
        },
      }),
    );
    for (const [filePath, content] of Object.entries(files)) {
      tree.create(filePath, content);
    }
    return tree;
  }

  async function runSchematic(tree: Tree): Promise<void> {
    await runner.runSchematic('legacy-i18n-services', {}, tree);
  }

  it('should swap the app resources service', async () => {
    const tree = setupTree({
      '/src/app/test.component.ts': `import { Component, inject } from '@angular/core';
import { SkyAppResourcesService } from '@skyux/i18n';

@Component({ selector: 'app-test', template: '' })
export class TestComponent {
  readonly #resourcesSvc = inject(SkyAppResourcesService);

  constructor(private resources: SkyAppResourcesService) {}
}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.ts'))
      .toBe(`import { Component, inject } from '@angular/core';
import { SkyAppResourcesLegacyService } from '@skyux/i18n';

@Component({ selector: 'app-test', template: '' })
export class TestComponent {
  readonly #resourcesSvc = inject(SkyAppResourcesLegacyService);

  constructor(private resources: SkyAppResourcesLegacyService) {}
}`);
  });

  it('should swap the lib resources service', async () => {
    const tree = setupTree({
      '/projects/lib/src/lib/test.service.ts': `import { Injectable, inject } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

@Injectable()
export class TestService {
  readonly #resourcesSvc = inject(SkyLibResourcesService);
}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/projects/lib/src/lib/test.service.ts'))
      .toBe(`import { Injectable, inject } from '@angular/core';
import { SkyLibResourcesLegacyService } from '@skyux/i18n';

@Injectable()
export class TestService {
  readonly #resourcesSvc = inject(SkyLibResourcesLegacyService);
}`);
  });

  it('should swap both services imported together', async () => {
    const tree = setupTree({
      '/src/app/test.service.ts': `import { Injectable, inject } from '@angular/core';
import { SkyAppResourcesService, SkyLibResourcesService } from '@skyux/i18n';

@Injectable()
export class TestService {
  readonly #appResourcesSvc = inject(SkyAppResourcesService);
  readonly #libResourcesSvc = inject(SkyLibResourcesService);
}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.service.ts'))
      .toBe(`import { Injectable, inject } from '@angular/core';
import { SkyAppResourcesLegacyService, SkyLibResourcesLegacyService } from '@skyux/i18n';

@Injectable()
export class TestService {
  readonly #appResourcesSvc = inject(SkyAppResourcesLegacyService);
  readonly #libResourcesSvc = inject(SkyLibResourcesLegacyService);
}`);
  });

  it('should swap aliased resources imports', async () => {
    const tree = setupTree({
      '/src/app/test.service.ts': `import { Injectable, inject } from '@angular/core';
import { SkyAppResourcesService as Resources } from '@skyux/i18n';

@Injectable()
export class TestService {
  readonly #resourcesSvc = inject(Resources);
}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.service.ts'))
      .toBe(`import { Injectable, inject } from '@angular/core';
import { SkyAppResourcesService as Resources } from '@skyux/i18n';

@Injectable()
export class TestService {
  readonly #resourcesSvc = inject(Resources);
}`);
  });

  it('should ignore namespace-qualified addResources references', async () => {
    const tree = setupTree({
      '/projects/lib/src/lib/lib-resources.module.ts': `import { NgModule } from '@angular/core';
import * as i18n from '@skyux/i18n';

i18n.SkyLibResourcesService.addResources({ 'EN-US': {} });

@NgModule({})
export class SkyLibResourcesModule {}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/projects/lib/src/lib/lib-resources.module.ts'))
      .toBe(`import { NgModule } from '@angular/core';
import * as i18n from '@skyux/i18n';

i18n.SkyLibResourcesService.addResources({ 'EN-US': {} });

@NgModule({})
export class SkyLibResourcesModule {}`);
  });

  it('should not swap the addResources static call', async () => {
    const resourcesModule = `import { NgModule } from '@angular/core';
import { SkyI18nModule, SkyLibResourcesService } from '@skyux/i18n';

SkyLibResourcesService.addResources({ 'EN-US': {} });

@NgModule({ exports: [SkyI18nModule] })
export class SkyLibResourcesModule {}`;

    const tree = setupTree({
      '/projects/lib/src/lib/lib-resources.module.ts': resourcesModule,
    });

    await runSchematic(tree);

    expect(tree.readText('/projects/lib/src/lib/lib-resources.module.ts')).toBe(
      resourcesModule,
    );
  });

  it('should swap instance usage while leaving the addResources static call', async () => {
    const tree = setupTree({
      '/src/app/test.service.ts': `import { Injectable, inject } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

SkyLibResourcesService.addResources({ 'EN-US': {} });

@Injectable()
export class TestService {
  readonly #resourcesSvc = inject(SkyLibResourcesService);
}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.service.ts'))
      .toBe(`import { Injectable, inject } from '@angular/core';
import { SkyLibResourcesService, SkyLibResourcesLegacyService } from '@skyux/i18n';

SkyLibResourcesService.addResources({ 'EN-US': {} });

@Injectable()
export class TestService {
  readonly #resourcesSvc = inject(SkyLibResourcesLegacyService);
}`);
  });

  it('should swap namespace-qualified instance references', async () => {
    const tree = setupTree({
      '/src/app/test.service.ts': `import { Injectable } from '@angular/core';
import * as i18n from '@skyux/i18n';

@Injectable()
export class TestService {
  readonly #resourcesSvc = new i18n.SkyAppResourcesService();
}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.service.ts'))
      .toBe(`import { Injectable } from '@angular/core';
import * as i18n from '@skyux/i18n';

@Injectable()
export class TestService {
  readonly #resourcesSvc = new i18n.SkyAppResourcesService();
}`);
  });

  it('should not swap services imported from another module', async () => {
    const content = `import { SkyAppResourcesService } from './resources.service';

export const svc = SkyAppResourcesService;`;

    const tree = setupTree({
      '/src/app/test.ts': content,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.ts')).toBe(content);
  });

  it('should not change unrelated files', async () => {
    const content = `import { SkyAppLocaleProvider } from '@skyux/i18n';

export const provider = SkyAppLocaleProvider;`;

    const tree = setupTree({
      '/src/app/test.ts': content,
      '/src/styles.css': 'body { color: red; }',
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.ts')).toBe(content);
  });
});
