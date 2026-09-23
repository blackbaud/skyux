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
      '/projects/lib/src/lib/lib-resources.module.ts': `import { NgModule, inject } from '@angular/core';
import * as i18n from '@skyux/i18n';
import { SkyLibResourcesService } from '@skyux/i18n';

i18n.SkyLibResourcesService.addResources({ 'EN-US': {} });

@NgModule({})
export class SkyLibResourcesModule {
  readonly #resourcesSvc = inject(SkyLibResourcesService);
}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/projects/lib/src/lib/lib-resources.module.ts'))
      .toBe(`import { NgModule, inject } from '@angular/core';
import * as i18n from '@skyux/i18n';
import { SkyLibResourcesLegacyService } from '@skyux/i18n';

i18n.SkyLibResourcesService.addResources({ 'EN-US': {} });

@NgModule({})
export class SkyLibResourcesModule {
  readonly #resourcesSvc = inject(SkyLibResourcesLegacyService);
}`);
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

  it('should ignore namespace-qualified instance references', async () => {
    const tree = setupTree({
      '/src/app/test.service.ts': `import { Injectable, inject } from '@angular/core';
import * as i18n from '@skyux/i18n';
import { SkyAppResourcesService } from '@skyux/i18n';

@Injectable()
export class TestService {
  readonly #namespacedSvc = new i18n.SkyAppResourcesService();
  readonly #resourcesSvc = inject(SkyAppResourcesService);
}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.service.ts'))
      .toBe(`import { Injectable, inject } from '@angular/core';
import * as i18n from '@skyux/i18n';
import { SkyAppResourcesLegacyService } from '@skyux/i18n';

@Injectable()
export class TestService {
  readonly #namespacedSvc = new i18n.SkyAppResourcesService();
  readonly #resourcesSvc = inject(SkyAppResourcesLegacyService);
}`);
  });

  it('should ignore namespace-qualified type references', async () => {
    const tree = setupTree({
      '/src/app/test.service.ts': `import { Injectable, inject } from '@angular/core';
import * as i18n from '@skyux/i18n';
import { SkyAppResourcesService } from '@skyux/i18n';

@Injectable()
export class TestService {
  namespacedSvc: i18n.SkyAppResourcesService | undefined;
  readonly #resourcesSvc = inject(SkyAppResourcesService);
}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.service.ts'))
      .toBe(`import { Injectable, inject } from '@angular/core';
import * as i18n from '@skyux/i18n';
import { SkyAppResourcesLegacyService } from '@skyux/i18n';

@Injectable()
export class TestService {
  namespacedSvc: i18n.SkyAppResourcesService | undefined;
  readonly #resourcesSvc = inject(SkyAppResourcesLegacyService);
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

  it('should swap the service in a file with a UTF-8 BOM', async () => {
    const bom = '\uFEFF';
    const tree = setupTree({
      '/src/app/test.component.ts': `${bom}import { Component, inject } from '@angular/core';
import { SkyAppResourcesService, SkyI18nModule } from '@skyux/i18n';

@Component({ selector: 'app-test', template: '' })
export class TestComponent {
  readonly #resources = inject(SkyAppResourcesService);
}`,
    });

    await runSchematic(tree);

    // `Tree#readText` decodes and strips the BOM, so assert against the
    // BOM-less text here...
    expect(tree.readText('/src/app/test.component.ts'))
      .toBe(`import { Component, inject } from '@angular/core';
import { SkyAppResourcesLegacyService, SkyI18nModule } from '@skyux/i18n';

@Component({ selector: 'app-test', template: '' })
export class TestComponent {
  readonly #resources = inject(SkyAppResourcesLegacyService);
}`);

    // ...and separately confirm the BOM byte sequence is still present (and
    // the edits weren't shifted) in the raw file content.
    const rawContent = tree
      .read('/src/app/test.component.ts')
      ?.toString('utf-8');
    expect(rawContent?.startsWith(bom)).toBe(true);
    expect(rawContent).toContain('SkyAppResourcesLegacyService, SkyI18nModule');
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

  it('should duplicate a provider token instead of renaming it', async () => {
    const tree = setupTree({
      '/src/app/test.component.spec.ts': `import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
  ],
});`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.spec.ts'))
      .toBe(`import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyAppResourcesLegacyService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
    { provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService },
  ],
});`);
  });

  it('should duplicate a provider token and rename a separate injected reference', async () => {
    const tree = setupTree({
      '/src/app/test.service.spec.ts': `import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
  ],
});

const resources = TestBed.inject(SkyAppResourcesService);`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.service.spec.ts'))
      .toBe(`import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyAppResourcesLegacyService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
    { provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService },
  ],
});

const resources = TestBed.inject(SkyAppResourcesLegacyService);`);
  });

  it('should duplicate both provider tokens when provided together', async () => {
    const tree = setupTree({
      '/src/app/test-both.spec.ts': `import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyLibResourcesService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
    { provide: SkyLibResourcesService, useClass: SkyLibResourcesTestService },
  ],
});`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-both.spec.ts'))
      .toBe(`import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyLibResourcesService, SkyAppResourcesLegacyService, SkyLibResourcesLegacyService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
    { provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService },
    { provide: SkyLibResourcesService, useClass: SkyLibResourcesTestService },
    { provide: SkyLibResourcesLegacyService, useExisting: SkyLibResourcesService },
  ],
});`);
  });

  it('should be idempotent when a provider token is already duplicated', async () => {
    const tree = setupTree({
      '/src/app/test.component.spec.ts': `import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
  ],
});`,
    });

    await runSchematic(tree);
    const firstRunResult = tree.readText('/src/app/test.component.spec.ts');

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.spec.ts')).toBe(
      firstRunResult,
    );
  });

  it('should rename a provider token that is not inside an array', async () => {
    const tree = setupTree({
      '/src/app/test-outside-array.ts': `import { SkyAppResourcesService } from '@skyux/i18n';

const provider = { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService };`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-outside-array.ts'))
      .toBe(`import { SkyAppResourcesLegacyService } from '@skyux/i18n';

const provider = { provide: SkyAppResourcesLegacyService, useClass: SkyAppResourcesTestService };`);
  });

  it('should rename a consumer alias that points at the service', async () => {
    const tree = setupTree({
      '/src/app/test-alias.ts': `import { NgModule } from '@angular/core';
import { SkyAppResourcesService } from '@skyux/i18n';

import { MY_RESOURCES } from './my-resources';

@NgModule({
  providers: [
    { provide: MY_RESOURCES, useExisting: SkyAppResourcesService },
  ],
})
export class TestModule {}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-alias.ts'))
      .toBe(`import { NgModule } from '@angular/core';
import { SkyAppResourcesLegacyService } from '@skyux/i18n';

import { MY_RESOURCES } from './my-resources';

@NgModule({
  providers: [
    { provide: MY_RESOURCES, useExisting: SkyAppResourcesLegacyService },
  ],
})
export class TestModule {}`);
  });

  it('should duplicate a provider token referenced through a variable', async () => {
    const tree = setupTree({
      '/src/app/test-variable.spec.ts': `import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService } from '@skyux/i18n';

const resourcesProvider = { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService };

TestBed.configureTestingModule({
  providers: [
    resourcesProvider,
  ],
});`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-variable.spec.ts'))
      .toBe(`import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyAppResourcesLegacyService } from '@skyux/i18n';

const resourcesProvider = { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService };

TestBed.configureTestingModule({
  providers: [
    resourcesProvider,
    { provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService },
  ],
});`);
  });

  it('should not duplicate a provider token for a same-named class from another module', async () => {
    const content = `import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService } from './resources.service';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
  ],
});`;

    const tree = setupTree({
      '/src/app/test-other-module.spec.ts': content,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-other-module.spec.ts')).toBe(content);
  });

  it('should import the legacy service when it is only imported as a type', async () => {
    const tree = setupTree({
      '/src/app/test-type-only.spec.ts': `import { TestBed } from '@angular/core/testing';
import type { SkyAppResourcesLegacyService } from '@skyux/i18n';
import { SkyAppResourcesService } from '@skyux/i18n';

let resources: SkyAppResourcesLegacyService | undefined;

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
  ],
});`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-type-only.spec.ts'))
      .toBe(`import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesLegacyService } from '@skyux/i18n';
import { SkyAppResourcesService } from '@skyux/i18n';

let resources: SkyAppResourcesLegacyService | undefined;

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
    { provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService },
  ],
});`);
  });

  it('should import the legacy service when the existing import is aliased', async () => {
    const tree = setupTree({
      '/src/app/test-aliased.spec.ts': `import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesLegacyService as Legacy } from '@skyux/i18n';
import { SkyAppResourcesService } from '@skyux/i18n';

let resources: Legacy | undefined;

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
  ],
});`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-aliased.spec.ts'))
      .toBe(`import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesLegacyService as Legacy } from '@skyux/i18n';
import { SkyAppResourcesService } from '@skyux/i18n';
import { SkyAppResourcesLegacyService } from '@skyux/i18n';

let resources: Legacy | undefined;

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
    { provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService },
  ],
});`);
  });

  it('should import the legacy service when only a specifier is type-only', async () => {
    const tree = setupTree({
      '/src/app/test-specifier-type-only.spec.ts': `import { TestBed } from '@angular/core/testing';
import { type SkyAppResourcesLegacyService, SkyAppResourcesService } from '@skyux/i18n';

let resources: SkyAppResourcesLegacyService | undefined;

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
  ],
});`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-specifier-type-only.spec.ts'))
      .toBe(`import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesLegacyService, SkyAppResourcesService } from '@skyux/i18n';

let resources: SkyAppResourcesLegacyService | undefined;

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
    { provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService },
  ],
});`);
  });

  it('should import the legacy service alongside a namespace import', async () => {
    const tree = setupTree({
      '/src/app/test-namespace.spec.ts': `import { TestBed } from '@angular/core/testing';
import * as i18n from '@skyux/i18n';
import { SkyAppResourcesService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: i18n.SkyAppResourcesService },
  ],
});`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-namespace.spec.ts'))
      .toBe(`import { TestBed } from '@angular/core/testing';
import * as i18n from '@skyux/i18n';
import { SkyAppResourcesService } from '@skyux/i18n';
import { SkyAppResourcesLegacyService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: i18n.SkyAppResourcesService },
    { provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService },
  ],
});`);
  });

  it('should rename a provider token in an object that is not assigned to a variable', async () => {
    const tree = setupTree({
      '/src/app/test-returned-provider.ts': `import { SkyAppResourcesService } from '@skyux/i18n';

export function createProvider() {
  return { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService };
}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-returned-provider.ts'))
      .toBe(`import { SkyAppResourcesLegacyService } from '@skyux/i18n';

export function createProvider() {
  return { provide: SkyAppResourcesLegacyService, useClass: SkyAppResourcesTestService };
}`);
  });

  it('should use CRLF line endings when duplicating a provider token in a CRLF file', async () => {
    const toCrlf = (text: string): string => text.replace(/\n/g, '\r\n');
    const original = toCrlf(`import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
  ],
});`);

    const tree = setupTree({
      '/src/app/test.component.spec.ts': original,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.spec.ts')).toBe(
      toCrlf(`import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyAppResourcesLegacyService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [
    { provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService },
    { provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService },
  ],
});`),
    );
  });

  it('should duplicate a provider token declared on the same line as the array', async () => {
    const tree = setupTree({
      '/src/app/test-inline.spec.ts': `import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [{ provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService }],
});`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test-inline.spec.ts'))
      .toBe(`import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyAppResourcesLegacyService } from '@skyux/i18n';

TestBed.configureTestingModule({
  providers: [{ provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService }, { provide: SkyAppResourcesLegacyService, useExisting: SkyAppResourcesService }],
});`);
  });
});
