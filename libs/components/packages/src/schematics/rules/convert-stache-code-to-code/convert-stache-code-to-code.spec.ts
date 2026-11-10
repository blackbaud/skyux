import {
  stripIndent,
  stripIndents,
} from '@angular-devkit/core/src/utils/literals';
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
    dependencies: Record<string, string> = { [STACHE_PACKAGE]: '12.0.0' },
  ): Promise<UnitTestTree> {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const packageJson = JSON.parse(tree.readText('package.json'));
    Object.assign(packageJson.dependencies, dependencies);
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

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

  async function convertFile(
    content: string,
    filePath = 'src/app/foo.component.ts',
  ): Promise<string> {
    const result = await convert(await setup({ [filePath]: content }));

    return result.readText(filePath);
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
    const dependencies = getDependencies(result);
    expect(dependencies['@skyux/code']).toEqual('0.0.0-PLACEHOLDER');
    expect(dependencies[STACHE_PACKAGE]).toBeUndefined();
  });

  it('should swap SkyCodeModule in NgModule imports and exports', async () => {
    const result = await convertFile(
      stripIndents`
        import { NgModule } from '@angular/core';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        @NgModule({
          imports: [SkyCodeModule],
          exports: [SkyCodeModule],
        })
        export class SharedModule {}
      `,
      'src/app/shared.module.ts',
    );

    expect(result).toEqual(stripIndents`
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
    const result = await convertFile(
      stripIndents`
        import { TestBed } from '@angular/core/testing';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [SkyCodeModule],
          });
        });
      `,
      'src/app/foo.component.spec.ts',
    );

    expect(result).toEqual(stripIndents`
      import { TestBed } from '@angular/core/testing';
      import { SkyCode } from '@skyux/code';

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [SkyCode],
        });
      });
    `);
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
    const dependencies = getDependencies(result);
    expect(dependencies[STACHE_PACKAGE]).toEqual('12.0.0');
    expect(dependencies['@skyux/code']).toEqual('0.0.0-PLACEHOLDER');
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
    const result = await convertFile(stripIndents`
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
    `);

    expect(result).toEqual(stripIndents`
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

  it('should swap SkyCodeModule in a plain array that lists SkyCode', async () => {
    const tree = await setup({
      'src/app/foo.ts': stripIndents`
        import { SkyCodeModule } from '${STACHE_PACKAGE}';
        import { SkyCode } from '@skyux/code';

        export const IMPORTS = [SkyCodeModule, SkyCode];
      `,
    });

    const result = await convert(tree);

    // The duplicate is harmless: Angular de-duplicates `imports`.
    expect(result.readText('src/app/foo.ts')).toEqual(stripIndents`
      import { SkyCode } from '@skyux/code';

      export const IMPORTS = [SkyCode, SkyCode];
    `);
    expect(getDependencies(result)[STACHE_PACKAGE]).toBeUndefined();
  });

  it('should keep an existing @skyux/code version', async () => {
    const tree = await setup(
      {
        'src/app/foo.ts': stripIndents`
          import { SkyCodeModule } from '${STACHE_PACKAGE}';

          export const IMPORTS = [SkyCodeModule];
        `,
      },
      { [STACHE_PACKAGE]: '12.0.0', '@skyux/code': '15.8.0' },
    );

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
      {},
    );
    const fooContent = tree.readText('src/app/foo.component.ts');
    const packageJson = tree.readText('package.json');

    const result = await convert(tree);

    expect(result.readText('src/app/foo.component.ts')).toEqual(fooContent);
    expect(result.readText('package.json')).toEqual(packageJson);
  });

  describe('multi-line formatting', () => {
    it('should remove SkyCodeModule when it is last in a multi-line import', async () => {
      const result = await convertFile(stripIndent`
        import {
          SkyCodeBlockModule,
          SkyCodeModule,
        } from '${STACHE_PACKAGE}';

        export const IMPORTS = [SkyCodeBlockModule, SkyCodeModule];
      `);

      expect(result).toEqual(stripIndent`
        import {
          SkyCodeBlockModule,
        } from '${STACHE_PACKAGE}';
        import { SkyCode } from '@skyux/code';

        export const IMPORTS = [SkyCodeBlockModule, SkyCode];
      `);
    });

    it('should remove SkyCodeModule when it is first in a multi-line import', async () => {
      const result = await convertFile(stripIndent`
        import {
          SkyCodeModule,
          SkyCodeBlockModule,
        } from '${STACHE_PACKAGE}';

        export const IMPORTS = [SkyCodeModule, SkyCodeBlockModule];
      `);

      expect(result).toEqual(stripIndent`
        import {
          SkyCodeBlockModule,
        } from '${STACHE_PACKAGE}';
        import { SkyCode } from '@skyux/code';

        export const IMPORTS = [SkyCode, SkyCodeBlockModule];
      `);
    });

    it('should remove a multi-line import that only imports SkyCodeModule', async () => {
      const result = await convertFile(stripIndent`
        import { Component } from '@angular/core';
        import {
          SkyCodeModule,
        } from '${STACHE_PACKAGE}';

        export const IMPORTS = [SkyCodeModule];
      `);

      expect(result).toEqual(stripIndent`
        import { Component } from '@angular/core';
        import { SkyCode } from '@skyux/code';

        export const IMPORTS = [SkyCode];
      `);
    });

    it.each([
      ['first', ['SkyCodeModule', 'CommonModule', 'FormsModule']],
      ['in the middle', ['CommonModule', 'SkyCodeModule', 'FormsModule']],
      ['last', ['CommonModule', 'FormsModule', 'SkyCodeModule']],
      ['alone', ['SkyCodeModule']],
    ])(
      'should swap SkyCodeModule %s in multi-line metadata arrays',
      async (_position, names) => {
        function toFile(moduleImport: string, moduleName: string): string {
          const array = (field: string): string[] => [
            `  ${field}: [`,
            ...names.map(
              (name) => `    ${name === 'SkyCodeModule' ? moduleName : name},`,
            ),
            '  ],',
          ];

          return [
            `import { Component, NgModule } from '@angular/core';`,
            `import { TestBed } from '@angular/core/testing';`,
            moduleImport,
            '',
            '@Component({',
            `  selector: 'app-foo',`,
            ...array('imports'),
            `  template: '',`,
            '})',
            'export class FooComponent {}',
            '',
            '@NgModule({',
            ...array('imports'),
            ...array('exports'),
            '})',
            'export class FooModule {}',
            '',
            'TestBed.configureTestingModule({',
            ...array('imports'),
            '});',
          ].join('\n');
        }

        const result = await convertFile(
          toFile(
            `import { SkyCodeModule } from '${STACHE_PACKAGE}';`,
            'SkyCodeModule',
          ),
        );

        expect(result).toEqual(
          toFile(`import { SkyCode } from '@skyux/code';`, 'SkyCode'),
        );
      },
    );

    it('should remove SkyCodeModule last in a multi-line array that lists SkyCode', async () => {
      const result = await convertFile(stripIndent`
        import { Component } from '@angular/core';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';
        import { SkyCode } from '@skyux/code';

        @Component({
          selector: 'app-foo',
          imports: [
            SkyCode,
            SkyCodeModule,
          ],
          template: '',
        })
        export class FooComponent {}
      `);

      expect(result).toEqual(stripIndent`
        import { Component } from '@angular/core';
        import { SkyCode } from '@skyux/code';

        @Component({
          selector: 'app-foo',
          imports: [
            SkyCode,
          ],
          template: '',
        })
        export class FooComponent {}
      `);
    });

    it('should remove SkyCodeModule first in a multi-line array that lists SkyCode', async () => {
      const result = await convertFile(stripIndent`
        import { NgModule } from '@angular/core';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';
        import { SkyCode } from '@skyux/code';

        @NgModule({
          imports: [
            SkyCodeModule,
            SkyCode,
          ],
          exports: [
            SkyCodeModule,
            SkyCode,
          ],
        })
        export class FooModule {}
      `);

      expect(result).toEqual(stripIndent`
        import { NgModule } from '@angular/core';
        import { SkyCode } from '@skyux/code';

        @NgModule({
          imports: [
            SkyCode,
          ],
          exports: [
            SkyCode,
          ],
        })
        export class FooModule {}
      `);
    });

    it('should remove SkyCodeModule in the middle of a multi-line TestBed array that lists SkyCode', async () => {
      const result = await convertFile(stripIndent`
        import { TestBed } from '@angular/core/testing';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';
        import { SkyCode } from '@skyux/code';

        TestBed.configureTestingModule({
          imports: [
            SkyCode,
            SkyCodeModule,
            FooComponent,
          ],
        });
      `);

      expect(result).toEqual(stripIndent`
        import { TestBed } from '@angular/core/testing';
        import { SkyCode } from '@skyux/code';

        TestBed.configureTestingModule({
          imports: [
            SkyCode,
            FooComponent,
          ],
        });
      `);
    });

    it('should not import SkyCode again when a multi-line @skyux/code import has it', async () => {
      const result = await convertFile(stripIndent`
        import { Component } from '@angular/core';
        import {
          SkyCodeBlockModule,
          SkyCodeModule,
        } from '${STACHE_PACKAGE}';
        import {
          SkyCode,
        } from '@skyux/code';

        @Component({
          selector: 'app-foo',
          imports: [SkyCode],
          template: '',
        })
        export class FooComponent {}

        @Component({
          selector: 'app-bar',
          imports: [
            SkyCodeBlockModule,
            SkyCodeModule,
          ],
          template: '',
        })
        export class BarComponent {}
      `);

      expect(result).toEqual(stripIndent`
        import { Component } from '@angular/core';
        import {
          SkyCodeBlockModule,
        } from '${STACHE_PACKAGE}';
        import {
          SkyCode,
        } from '@skyux/code';

        @Component({
          selector: 'app-foo',
          imports: [SkyCode],
          template: '',
        })
        export class FooComponent {}

        @Component({
          selector: 'app-bar',
          imports: [
            SkyCodeBlockModule,
            SkyCode,
          ],
          template: '',
        })
        export class BarComponent {}
      `);
    });
  });
});
