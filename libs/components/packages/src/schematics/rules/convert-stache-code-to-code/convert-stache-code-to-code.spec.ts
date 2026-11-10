import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

describe('Convert Stache code to code', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  const STACHE_PACKAGE = '@blackbaud/skyux-lib-code-block';

  async function setup(
    files: Record<string, string>,
    stacheInstalled = true,
  ): Promise<UnitTestTree> {
    const tree = await createTestApp(runner, { projectName: 'test-app' });

    if (stacheInstalled) {
      const packageJson = JSON.parse(tree.readText('package.json'));
      packageJson.dependencies[STACHE_PACKAGE] = '12.0.0';
      tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
    }

    for (const [filePath, content] of Object.entries(files)) {
      tree.create(filePath, content);
    }

    return tree;
  }

  function convert(tree: UnitTestTree): Promise<UnitTestTree> {
    return runner.runSchematic(
      'convert-stache-code-to-code',
      { project: 'test-app' },
      tree,
    );
  }

  function getDependencies(tree: UnitTestTree): Record<string, string> {
    return JSON.parse(tree.readText('package.json')).dependencies;
  }

  it('should swap SkyCodeModule for SkyCode in component imports', async () => {
    const tree = await setup({
      'src/app/foo.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-foo',
          imports: [SkyCodeModule],
          template: '<sky-code>foo</sky-code>',
        })
        export class FooComponent {}
      `,
    });

    const result = await convert(tree);

    expect(result.readText('src/app/foo.component.ts')).toEqual(stripIndents`
      import { Component } from '@angular/core';
      import { SkyCode } from '@skyux/code';

      @Component({
        selector: 'app-foo',
        imports: [SkyCode],
        template: '<sky-code>foo</sky-code>',
      })
      export class FooComponent {}
    `);
    expect(getDependencies(result)['@skyux/code']).toEqual('0.0.0-PLACEHOLDER');
    expect(getDependencies(result)[STACHE_PACKAGE]).toBeUndefined();
  });

  it('should swap SkyCodeModule in NgModule imports and exports', async () => {
    const tree = await setup({
      'src/app/shared.module.ts': stripIndents`
        import { NgModule } from '@angular/core';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        @NgModule({
          imports: [SkyCodeModule],
          exports: [SkyCodeModule],
        })
        export class SharedModule {}
      `,
    });

    const result = await convert(tree);

    expect(result.readText('src/app/shared.module.ts')).toEqual(stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyCode } from '@skyux/code';

      @NgModule({
        imports: [SkyCode],
        exports: [SkyCode],
      })
      export class SharedModule {}
    `);
  });

  it('should swap SkyCodeModule in TestBed imports', async () => {
    const tree = await setup({
      'src/app/foo.component.spec.ts': stripIndents`
        import { TestBed } from '@angular/core/testing';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [SkyCodeModule],
          });
        });
      `,
    });

    const result = await convert(tree);

    expect(result.readText('src/app/foo.component.spec.ts')).toEqual(
      stripIndents`
        import { TestBed } from '@angular/core/testing';
        import { SkyCode } from '@skyux/code';

        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [SkyCode],
          });
        });
      `,
    );
  });

  it('should keep other Stache imports and the Stache dependency', async () => {
    const tree = await setup({
      'src/app/foo.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeBlockModule, SkyCodeModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-foo',
          imports: [SkyCodeBlockModule, SkyCodeModule],
          template: '',
        })
        export class FooComponent {}
      `,
    });

    const result = await convert(tree);

    expect(result.readText('src/app/foo.component.ts')).toEqual(stripIndents`
      import { Component } from '@angular/core';
      import { SkyCodeBlockModule } from '${STACHE_PACKAGE}';
      import { SkyCode } from '@skyux/code';

      @Component({
        selector: 'app-foo',
        imports: [SkyCodeBlockModule, SkyCode],
        template: '',
      })
      export class FooComponent {}
    `);
    expect(getDependencies(result)[STACHE_PACKAGE]).toEqual('12.0.0');
    expect(getDependencies(result)['@skyux/code']).toEqual('0.0.0-PLACEHOLDER');
  });

  it('should keep the Stache dependency when another file imports from it', async () => {
    const tree = await setup({
      'src/app/foo.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-foo',
          imports: [SkyCodeModule],
          template: '',
        })
        export class FooComponent {}
      `,
      'src/app/bar.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeBlockModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-bar',
          imports: [SkyCodeBlockModule],
          template: '',
        })
        export class BarComponent {}
      `,
    });
    const barContent = tree.readText('src/app/bar.component.ts');

    const result = await convert(tree);

    expect(result.readText('src/app/bar.component.ts')).toEqual(barContent);
    expect(getDependencies(result)[STACHE_PACKAGE]).toEqual('12.0.0');
  });

  it('should not list SkyCode twice when it is already imported', async () => {
    const tree = await setup({
      'src/app/foo.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';
        import { SkyCode } from '@skyux/code';

        @Component({
          selector: 'app-foo',
          imports: [SkyCode, SkyCodeModule],
          template: '',
        })
        export class FooComponent {}

        @Component({
          selector: 'app-bar',
          imports: [SkyCodeModule],
          template: '',
        })
        export class BarComponent {}
      `,
    });

    const result = await convert(tree);

    expect(result.readText('src/app/foo.component.ts')).toEqual(stripIndents`
      import { Component } from '@angular/core';
      import { SkyCode } from '@skyux/code';

      @Component({
        selector: 'app-foo',
        imports: [SkyCode],
        template: '',
      })
      export class FooComponent {}

      @Component({
        selector: 'app-bar',
        imports: [SkyCode],
        template: '',
      })
      export class BarComponent {}
    `);
  });

  it('should keep an existing @skyux/code version', async () => {
    const tree = await setup({
      'src/app/foo.ts': stripIndents`
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        export const IMPORTS = [SkyCodeModule];
      `,
    });
    const packageJson = JSON.parse(tree.readText('package.json'));
    packageJson.dependencies['@skyux/code'] = '15.8.0';
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    const result = await convert(tree);

    expect(result.readText('src/app/foo.ts')).toEqual(stripIndents`
      import { SkyCode } from '@skyux/code';

      export const IMPORTS = [SkyCode];
    `);
    expect(getDependencies(result)['@skyux/code']).toEqual('15.8.0');
  });

  it('should produce the same result when run twice', async () => {
    const tree = await setup({
      'src/app/foo.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeBlockModule, SkyCodeModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-foo',
          imports: [SkyCodeBlockModule, SkyCodeModule],
          template: '',
        })
        export class FooComponent {}
      `,
    });

    const once = await convert(tree);
    const onceContent = once.readText('src/app/foo.component.ts');
    const oncePackageJson = once.readText('package.json');

    const twice = await convert(once);

    expect(twice.readText('src/app/foo.component.ts')).toEqual(onceContent);
    expect(twice.readText('package.json')).toEqual(oncePackageJson);
  });

  it('should not change a project without Stache code usage', async () => {
    const tree = await setup(
      {
        'src/app/foo.component.ts': stripIndents`
          import { Component } from '@angular/core';
          import { SkyCodeModule } from './local-code.module';

          @Component({
            selector: 'app-foo',
            imports: [SkyCodeModule],
            template: '',
          })
          export class FooComponent {}
        `,
        'src/app/bar.component.ts': stripIndents`
          import { Component } from '@angular/core';

          @Component({ selector: 'app-bar', template: '' })
          export class BarComponent {}
        `,
        'src/app/types.d.ts': `export declare const SkyCodeModule: unknown;`,
      },
      false,
    );
    const fooContent = tree.readText('src/app/foo.component.ts');
    const packageJson = tree.readText('package.json');

    const result = await convert(tree);

    expect(result.readText('src/app/foo.component.ts')).toEqual(fooContent);
    expect(result.readText('package.json')).toEqual(packageJson);
  });
});
