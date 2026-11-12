import {
  stripIndent,
  stripIndents,
} from '@angular-devkit/core/src/utils/literals';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

describe('Convert Stache blockquote to blockquote', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  const STACHE_PACKAGE = '@blackbaud/skyux-lib-stache';
  const BACKTICK = '`';
  const QUOTE_TEMPLATE_PATH = 'src/app/quote/quote.component.html';

  const warnings: string[] = [];

  beforeAll(() => {
    runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnings.push(entry.message);
      }
    });
  });

  beforeEach(() => {
    warnings.length = 0;
  });

  async function setup(
    files: Record<string, string>,
    dependencies: Record<string, string> = { [STACHE_PACKAGE]: '14.0.0' },
  ): Promise<UnitTestTree> {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const packageJson = JSON.parse(tree.readText('package.json'));
    Object.assign(packageJson.dependencies, dependencies);
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    // The schematic only converts a project that renders a Stache blockquote.
    tree.create(
      QUOTE_TEMPLATE_PATH,
      '<stache-blockquote>Quote</stache-blockquote>',
    );

    for (const [filePath, content] of Object.entries(files)) {
      tree.create(filePath, content);
    }

    return tree;
  }

  function convert(tree: UnitTestTree): Promise<UnitTestTree> {
    return runner.runSchematic(
      'convert-stache-blockquote-to-blockquote',
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

  const blockquoteModuleUsage = stripIndents`
    import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';

    export const IMPORTS = [StacheBlockquoteModule];
  `;

  it('should swap StacheBlockquoteModule for SkyBlockquote and rename an inline template', async () => {
    const tree = await setup({
      'src/app/foo.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-foo',
          imports: [StacheBlockquoteModule],
          template: '<stache-blockquote author="Jane">Quote</stache-blockquote>',
        })
        export class FooComponent {}
      `,
    });

    const result = await convert(tree);

    expect(result.readText('src/app/foo.component.ts')).toEqual(stripIndents`
      import { Component } from '@angular/core';
      import { SkyBlockquote } from '@skyux/layout';

      @Component({
        selector: 'app-foo',
        imports: [SkyBlockquote],
        template: '<sky-blockquote author="Jane">Quote</sky-blockquote>',
      })
      export class FooComponent {}
    `);
    const dependencies = getDependencies(result);
    expect(dependencies['@skyux/layout']).toEqual('0.0.0-PLACEHOLDER');
    expect(dependencies[STACHE_PACKAGE]).toBeUndefined();
    expect(warnings).toEqual([]);
  });

  it('should rename tags in an external template, keeping attributes and content', async () => {
    const tree = await setup({
      'src/app/foo.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-foo',
          imports: [StacheBlockquoteModule],
          templateUrl: './foo.component.html',
        })
        export class FooComponent {}
      `,
      'src/app/foo.component.html': stripIndent`
        <h2>Testimonials</h2>
        @if (showQuotes) {
          <stache-blockquote
            author="Happy Customer"
            [quoteSource]="sourceUrl"
          >
            <p>Great <strong>product</strong>!</p>
          </stache-blockquote>
        }
        <stache-blockquote [author]="author" quoteSource="https://example.com/">Another</stache-blockquote>
        <stache-blockquote-like>Not Stache</stache-blockquote-like>
      `,
    });

    const result = await convert(tree);

    expect(result.readText('src/app/foo.component.html')).toEqual(stripIndent`
      <h2>Testimonials</h2>
      @if (showQuotes) {
        <sky-blockquote
          author="Happy Customer"
          [quoteSource]="sourceUrl"
        >
          <p>Great <strong>product</strong>!</p>
        </sky-blockquote>
      }
      <sky-blockquote [author]="author" quoteSource="https://example.com/">Another</sky-blockquote>
      <stache-blockquote-like>Not Stache</stache-blockquote-like>
    `);
  });

  it('should rename a tag that follows a self-closing tag', async () => {
    const tree = await setup({
      'src/app/foo.ts': blockquoteModuleUsage,
      'src/app/foo.component.html':
        '<stache-blockquote quoteSource="https://example.com/" /><stache-blockquote>Quote</stache-blockquote>',
    });

    const result = await convert(tree);

    expect(result.readText('src/app/foo.component.html')).toEqual(
      '<sky-blockquote quoteSource="https://example.com/" /><sky-blockquote>Quote</sky-blockquote>',
    );
  });

  it('should rename a multi-line inline template and a self-closing tag', async () => {
    const result = await convertFile(stripIndent`
      import { Component } from '@angular/core';
      import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';

      @Component({
        selector: 'app-foo',
        imports: [StacheBlockquoteModule],
        template: ${BACKTICK}
          <stache-blockquote>
            Quote
          </stache-blockquote>
          <stache-blockquote quoteSource="https://example.com/" />
        ${BACKTICK},
      })
      export class FooComponent {}
    `);

    expect(result).toEqual(stripIndent`
      import { Component } from '@angular/core';
      import { SkyBlockquote } from '@skyux/layout';

      @Component({
        selector: 'app-foo',
        imports: [SkyBlockquote],
        template: ${BACKTICK}
          <sky-blockquote>
            Quote
          </sky-blockquote>
          <sky-blockquote quoteSource="https://example.com/" />
        ${BACKTICK},
      })
      export class FooComponent {}
    `);
  });

  it('should rename tags in other templates when a shared NgModule is converted', async () => {
    const tree = await setup({
      'src/app/shared.module.ts': stripIndents`
        import { NgModule } from '@angular/core';
        import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';

        @NgModule({
          imports: [StacheBlockquoteModule],
          exports: [StacheBlockquoteModule],
        })
        export class SharedModule {}
      `,
      'src/app/bar.component.html':
        '<stache-blockquote>Quote</stache-blockquote>',
    });

    const result = await convert(tree);

    expect(result.readText('src/app/shared.module.ts')).toEqual(stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyBlockquote } from '@skyux/layout';

      @NgModule({
        imports: [SkyBlockquote],
        exports: [SkyBlockquote],
      })
      export class SharedModule {}
    `);
    expect(result.readText('src/app/bar.component.html')).toEqual(
      '<sky-blockquote>Quote</sky-blockquote>',
    );
  });

  it('should also import SkyBlockquote in an NgModule that only exports StacheBlockquoteModule', async () => {
    const result = await convertFile(
      stripIndent`
        import { NgModule } from '@angular/core';
        import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';

        @NgModule({
          exports: [StacheBlockquoteModule],
        })
        export class SharedModule {}
      `,
      'src/app/shared.module.ts',
    );

    // Angular only lets an NgModule export a standalone component it imports.
    expect(result).toEqual(stripIndent`
      import { NgModule } from '@angular/core';
      import { SkyBlockquote } from '@skyux/layout';

      @NgModule({
        exports: [SkyBlockquote],
        imports: [
          SkyBlockquote
        ],
      })
      export class SharedModule {}
    `);
  });

  it('should swap StacheBlockquoteModule in TestBed imports', async () => {
    const result = await convertFile(
      stripIndents`
        import { TestBed } from '@angular/core/testing';
        import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';

        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [StacheBlockquoteModule],
          });
        });
      `,
      'src/app/foo.component.spec.ts',
    );

    expect(result).toEqual(stripIndents`
      import { TestBed } from '@angular/core/testing';
      import { SkyBlockquote } from '@skyux/layout';

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [SkyBlockquote],
        });
      });
    `);
  });

  describe('StacheModule', () => {
    it('should add SkyBlockquote next to StacheModule and keep the Stache dependency', async () => {
      const tree = await setup({
        'src/app/foo.component.ts': stripIndents`
          import { Component } from '@angular/core';
          import { StacheModule } from '${STACHE_PACKAGE}';

          @Component({
            selector: 'app-foo',
            imports: [StacheModule],
            template: '<stache-blockquote>Quote</stache-blockquote>',
          })
          export class FooComponent {}
        `,
      });

      const result = await convert(tree);

      expect(result.readText('src/app/foo.component.ts')).toEqual(stripIndents`
        import { Component } from '@angular/core';
        import { StacheModule } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        @Component({
          selector: 'app-foo',
          imports: [StacheModule, SkyBlockquote],
          template: '<sky-blockquote>Quote</sky-blockquote>',
        })
        export class FooComponent {}
      `);
      const dependencies = getDependencies(result);
      expect(dependencies[STACHE_PACKAGE]).toEqual('14.0.0');
      expect(dependencies['@skyux/layout']).toEqual('0.0.0-PLACEHOLDER');
    });

    it('should add SkyBlockquote to an NgModule that only exports StacheModule', async () => {
      const tree = await setup({
        'src/app/app-sky.module.ts': stripIndent`
          import { NgModule } from '@angular/core';
          import { StacheModule } from '${STACHE_PACKAGE}';

          @NgModule({
            exports: [StacheModule],
          })
          export class AppSkyModule {}
        `,
        'src/app/home.component.html':
          '<stache-blockquote>Quote</stache-blockquote>',
      });

      const result = await convert(tree);

      expect(result.readText('src/app/app-sky.module.ts')).toEqual(stripIndent`
        import { NgModule } from '@angular/core';
        import { StacheModule } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        @NgModule({
          exports: [StacheModule, SkyBlockquote],
          imports: [
            SkyBlockquote
          ],
        })
        export class AppSkyModule {}
      `);
      expect(result.readText('src/app/home.component.html')).toEqual(
        '<sky-blockquote>Quote</sky-blockquote>',
      );
    });

    it('should add SkyBlockquote next to StacheModule in NgModule, TestBed and plain arrays', async () => {
      const result = await convertFile(stripIndents`
        import { NgModule } from '@angular/core';
        import { TestBed } from '@angular/core/testing';
        import { StacheModule } from '${STACHE_PACKAGE}';

        export const IMPORTS = [StacheModule, CommonModule];

        @NgModule({
          imports: [StacheModule],
          exports: [StacheModule],
        })
        export class FooModule {}

        TestBed.configureTestingModule({
          imports: [StacheModule],
        });
      `);

      expect(result).toEqual(stripIndents`
        import { NgModule } from '@angular/core';
        import { TestBed } from '@angular/core/testing';
        import { StacheModule } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        export const IMPORTS = [StacheModule, SkyBlockquote, CommonModule];

        @NgModule({
          imports: [StacheModule, SkyBlockquote],
          exports: [StacheModule, SkyBlockquote],
        })
        export class FooModule {}

        TestBed.configureTestingModule({
          imports: [StacheModule, SkyBlockquote],
        });
      `);
    });

    it('should not add SkyBlockquote to an array that already lists it', async () => {
      const content = stripIndents`
        import { Component } from '@angular/core';
        import { StacheModule } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        @Component({
          selector: 'app-foo',
          imports: [StacheModule, SkyBlockquote],
          template: '',
        })
        export class FooComponent {}
      `;

      const result = await convertFile(content);

      expect(result).toEqual(content);
    });

    it('should list SkyBlockquote once when StacheModule and StacheBlockquoteModule share an array', async () => {
      const result = await convertFile(stripIndents`
        import { Component } from '@angular/core';
        import { StacheBlockquoteModule, StacheModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-foo',
          imports: [StacheModule, StacheBlockquoteModule],
          template: '',
        })
        export class FooComponent {}
      `);

      expect(result).toEqual(stripIndents`
        import { Component } from '@angular/core';
        import { StacheModule } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        @Component({
          selector: 'app-foo',
          imports: [StacheModule, SkyBlockquote],
          template: '',
        })
        export class FooComponent {}
      `);
    });
  });

  it('should keep other Stache imports and the Stache dependency', async () => {
    const tree = await setup({
      'src/app/foo.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { StacheBlockquoteModule, StacheNavModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-foo',
          imports: [StacheNavModule, StacheBlockquoteModule],
          template: '',
        })
        export class FooComponent {}
      `,
    });

    const result = await convert(tree);

    expect(result.readText('src/app/foo.component.ts')).toEqual(stripIndents`
      import { Component } from '@angular/core';
      import { StacheNavModule } from '${STACHE_PACKAGE}';
      import { SkyBlockquote } from '@skyux/layout';

      @Component({
        selector: 'app-foo',
        imports: [StacheNavModule, SkyBlockquote],
        template: '',
      })
      export class FooComponent {}
    `);
    const dependencies = getDependencies(result);
    expect(dependencies[STACHE_PACKAGE]).toEqual('14.0.0');
    expect(dependencies['@skyux/layout']).toEqual('0.0.0-PLACEHOLDER');
  });

  it('should keep the Stache dependency when another file imports from it', async () => {
    const tree = await setup({
      'src/app/foo.ts': blockquoteModuleUsage,
      'src/app/bar.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { StacheNavModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-bar',
          imports: [StacheNavModule],
          template: '',
        })
        export class BarComponent {}
      `,
    });
    const barContent = tree.readText('src/app/bar.component.ts');

    const result = await convert(tree);

    expect(result.readText('src/app/bar.component.ts')).toEqual(barContent);
    expect(getDependencies(result)[STACHE_PACKAGE]).toEqual('14.0.0');
  });

  it('should keep the Stache dependency when a file outside sourceRoot imports it', async () => {
    const tree = await setup({
      'src/app/foo.ts': blockquoteModuleUsage,
      'e2e/fixtures.ts': stripIndents`
        import { StacheNavModule } from '${STACHE_PACKAGE}';

        export const E2E_IMPORTS = [StacheNavModule];
      `,
    });

    const result = await convert(tree);

    expect(getDependencies(result)[STACHE_PACKAGE]).toEqual('14.0.0');
  });

  it('should add SkyBlockquote to an existing @skyux/layout import', async () => {
    const result = await convertFile(stripIndents`
      import { Component } from '@angular/core';
      import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';
      import { SkyBoxModule } from '@skyux/layout';

      @Component({
        selector: 'app-foo',
        imports: [SkyBoxModule, StacheBlockquoteModule],
        template: '',
      })
      export class FooComponent {}
    `);

    expect(result).toEqual(stripIndents`
      import { Component } from '@angular/core';
      import { SkyBoxModule, SkyBlockquote } from '@skyux/layout';

      @Component({
        selector: 'app-foo',
        imports: [SkyBoxModule, SkyBlockquote],
        template: '',
      })
      export class FooComponent {}
    `);
  });

  it('should not list SkyBlockquote twice when it is already imported', async () => {
    const result = await convertFile(stripIndents`
      import { Component } from '@angular/core';
      import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';
      import { SkyBlockquote } from '@skyux/layout';

      @Component({
        selector: 'app-foo',
        imports: [SkyBlockquote, StacheBlockquoteModule],
        template: '',
      })
      export class FooComponent {}

      @Component({
        selector: 'app-bar',
        imports: [StacheBlockquoteModule],
        template: '',
      })
      export class BarComponent {}
    `);

    expect(result).toEqual(stripIndents`
      import { Component } from '@angular/core';
      import { SkyBlockquote } from '@skyux/layout';

      @Component({
        selector: 'app-foo',
        imports: [SkyBlockquote],
        template: '',
      })
      export class FooComponent {}

      @Component({
        selector: 'app-bar',
        imports: [SkyBlockquote],
        template: '',
      })
      export class BarComponent {}
    `);
  });

  it('should swap StacheBlockquoteModule in a plain array that lists SkyBlockquote', async () => {
    const result = await convertFile(
      stripIndents`
        import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        export const IMPORTS = [StacheBlockquoteModule, SkyBlockquote];
      `,
      'src/app/foo.ts',
    );

    // The duplicate is harmless: Angular de-duplicates `imports`.
    expect(result).toEqual(stripIndents`
      import { SkyBlockquote } from '@skyux/layout';

      export const IMPORTS = [SkyBlockquote, SkyBlockquote];
    `);
  });

  it('should use the local name of an aliased SkyBlockquote import', async () => {
    const result = await convertFile(stripIndents`
      import { Component } from '@angular/core';
      import { StacheBlockquoteModule, StacheModule } from '${STACHE_PACKAGE}';
      import { SkyBlockquote as SkyUxBlockquote } from '@skyux/layout';

      @Component({
        selector: 'app-foo',
        imports: [SkyUxBlockquote, StacheBlockquoteModule],
        template: '',
      })
      export class FooComponent {}

      @Component({
        selector: 'app-bar',
        imports: [StacheBlockquoteModule],
        template: '',
      })
      export class BarComponent {}

      @Component({
        selector: 'app-baz',
        imports: [StacheModule],
        template: '',
      })
      export class BazComponent {}
    `);

    expect(result).toEqual(stripIndents`
      import { Component } from '@angular/core';
      import { StacheModule } from '${STACHE_PACKAGE}';
      import { SkyBlockquote as SkyUxBlockquote } from '@skyux/layout';

      @Component({
        selector: 'app-foo',
        imports: [SkyUxBlockquote],
        template: '',
      })
      export class FooComponent {}

      @Component({
        selector: 'app-bar',
        imports: [SkyUxBlockquote],
        template: '',
      })
      export class BarComponent {}

      @Component({
        selector: 'app-baz',
        imports: [StacheModule, SkyUxBlockquote],
        template: '',
      })
      export class BazComponent {}
    `);
  });

  describe('unconvertible usage', () => {
    const unconvertibleWarning = (filePath: string): string =>
      `"${filePath}" uses "StacheBlockquoteModule" or "StacheModule" from "${STACHE_PACKAGE}" through an alias, a namespace import or a re-export, which this schematic does not convert, so no files were changed. Import them by name instead, then run this schematic again.`;

    it.each([
      [
        'an aliased StacheBlockquoteModule import',
        stripIndents`
          import { StacheBlockquoteModule as Quote } from '${STACHE_PACKAGE}';

          export const IMPORTS = [Quote];
        `,
      ],
      [
        'an aliased StacheModule import',
        stripIndents`
          import { StacheModule as Stache } from '${STACHE_PACKAGE}';

          export const IMPORTS = [Stache];
        `,
      ],
      [
        'a namespace import',
        stripIndents`
          import * as stache from '${STACHE_PACKAGE}';

          export const IMPORTS = [stache.StacheModule];
        `,
      ],
      [
        'a named re-export',
        `export { StacheBlockquoteModule } from '${STACHE_PACKAGE}';`,
      ],
      ['a wildcard re-export', `export * from '${STACHE_PACKAGE}';`],
    ])(
      'should warn about %s and change no files',
      async (description, content) => {
        const filePath = `src/app/${description.replaceAll(' ', '-')}.ts`;
        const tree = await setup({
          [filePath]: content,
          'src/app/foo.ts': blockquoteModuleUsage,
          'src/app/foo.component.html':
            '<stache-blockquote>Quote</stache-blockquote>',
        });
        const packageJson = tree.readText('package.json');

        const result = await convert(tree);

        expect(result.readText(filePath)).toEqual(content);
        expect(result.readText('src/app/foo.ts')).toEqual(
          blockquoteModuleUsage,
        );
        expect(result.readText('src/app/foo.component.html')).toEqual(
          '<stache-blockquote>Quote</stache-blockquote>',
        );
        expect(result.readText('package.json')).toEqual(packageJson);
        expect(warnings).toEqual([unconvertibleWarning(`/${filePath}`)]);
      },
    );

    it('should convert a file whose namespace import does not use the blockquote', async () => {
      const result = await convertFile(
        stripIndents`
          import * as stache from '${STACHE_PACKAGE}';
          import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';

          export const NAV_IMPORTS = [stache.StacheNavModule];
          export const IMPORTS = [StacheBlockquoteModule];
        `,
        'src/app/foo.ts',
      );

      expect(result).toEqual(stripIndents`
        import * as stache from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        export const NAV_IMPORTS = [stache.StacheNavModule];
        export const IMPORTS = [SkyBlockquote];
      `);
      expect(warnings).toEqual([]);
    });
  });

  it('should warn about files that still refer to stache-blockquote', async () => {
    const tree = await setup({
      'src/app/foo.ts': blockquoteModuleUsage,
      'src/app/foo.component.scss': '.stache-blockquote-source { color: red; }',
      'src/app/foo.component.spec.ts': `const quote = document.querySelector('stache-blockquote');`,
      'src/app/bar.component.scss': '.bar { color: red; }',
    });

    await convert(tree);

    expect(warnings).toEqual([
      `"/src/app/foo.component.scss" still refers to "stache-blockquote", for example in a style or test selector. Update it for "sky-blockquote", which renders different markup and classes.`,
      `"/src/app/foo.component.spec.ts" still refers to "stache-blockquote", for example in a style or test selector. Update it for "sky-blockquote", which renders different markup and classes.`,
    ]);
  });

  it('should not add @skyux/layout to dependencies when it is a dev dependency', async () => {
    const tree = await setup({ 'src/app/foo.ts': blockquoteModuleUsage });
    const packageJson = JSON.parse(tree.readText('package.json'));
    packageJson.devDependencies['@skyux/layout'] = '15.10.0';
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    const result = await convert(tree);
    const { dependencies, devDependencies } = JSON.parse(
      result.readText('package.json'),
    );

    expect(dependencies['@skyux/layout']).toBeUndefined();
    expect(devDependencies['@skyux/layout']).toEqual('15.10.0');
  });

  it('should keep an existing @skyux/layout version', async () => {
    const tree = await setup(
      { 'src/app/foo.ts': blockquoteModuleUsage },
      { [STACHE_PACKAGE]: '14.0.0', '@skyux/layout': '15.10.0' },
    );

    const result = await convert(tree);

    expect(getDependencies(result)['@skyux/layout']).toEqual('15.10.0');
  });

  it('should produce the same result when run twice', async () => {
    const tree = await setup({
      'src/app/foo.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { StacheBlockquoteModule, StacheModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-foo',
          imports: [StacheModule],
          templateUrl: './foo.component.html',
        })
        export class FooComponent {}

        @Component({
          selector: 'app-bar',
          imports: [StacheBlockquoteModule],
          template: '<stache-blockquote>Quote</stache-blockquote>',
        })
        export class BarComponent {}
      `,
      'src/app/foo.component.html':
        '<stache-blockquote author="Jane">Quote</stache-blockquote>',
    });

    const once = await convert(tree);
    const files = [
      'src/app/foo.component.ts',
      'src/app/foo.component.html',
      'package.json',
    ];
    const onceContents = files.map((file) => once.readText(file));

    const twice = await convert(once);

    expect(files.map((file) => twice.readText(file))).toEqual(onceContents);
  });

  it('should not change a project that lists StacheModule but renders no Stache blockquote', async () => {
    const content = stripIndents`
      import { NgModule } from '@angular/core';
      import { StacheModule } from '${STACHE_PACKAGE}';

      @NgModule({
        exports: [StacheModule],
      })
      export class AppSkyModule {}
    `;
    const tree = await setup({ 'src/app/app-sky.module.ts': content });
    tree.delete(QUOTE_TEMPLATE_PATH);
    const packageJson = tree.readText('package.json');

    const result = await convert(tree);

    expect(result.readText('src/app/app-sky.module.ts')).toEqual(content);
    expect(result.readText('package.json')).toEqual(packageJson);
  });

  it('should not change a project without Stache blockquote usage', async () => {
    const tree = await setup(
      {
        'src/app/foo.component.ts': stripIndents`
          import { Component } from '@angular/core';
          import { StacheBlockquoteModule } from './local-blockquote.module';

          @Component({
            selector: 'app-foo',
            imports: [StacheBlockquoteModule],
            templateUrl: './foo.component.html',
          })
          export class FooComponent {}
        `,
        'src/app/foo.component.html':
          '<stache-blockquote>Quote</stache-blockquote>',
        'src/app/nav.ts': stripIndents`
          import { StacheNavModule } from '${STACHE_PACKAGE}';

          export const IMPORTS = [StacheNavModule];
        `,
        'src/app/types.d.ts': `export declare const StacheBlockquoteModule: unknown;`,
      },
      { [STACHE_PACKAGE]: '14.0.0' },
    );
    const files = [
      'src/app/foo.component.ts',
      'src/app/foo.component.html',
      'src/app/nav.ts',
      'package.json',
    ];
    const contents = files.map((file) => tree.readText(file));

    const result = await convert(tree);

    expect(files.map((file) => result.readText(file))).toEqual(contents);
    expect(warnings).toEqual([]);
  });

  describe('multi-line formatting', () => {
    it('should remove StacheBlockquoteModule when it is last in a multi-line import', async () => {
      const result = await convertFile(stripIndent`
        import {
          StacheNavModule,
          StacheBlockquoteModule,
        } from '${STACHE_PACKAGE}';

        export const IMPORTS = [StacheNavModule, StacheBlockquoteModule];
      `);

      expect(result).toEqual(stripIndent`
        import {
          StacheNavModule,
        } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        export const IMPORTS = [StacheNavModule, SkyBlockquote];
      `);
    });

    it('should remove StacheBlockquoteModule when it is first in a multi-line import', async () => {
      const result = await convertFile(stripIndent`
        import {
          StacheBlockquoteModule,
          StacheNavModule,
        } from '${STACHE_PACKAGE}';

        export const IMPORTS = [StacheBlockquoteModule, StacheNavModule];
      `);

      expect(result).toEqual(stripIndent`
        import {
          StacheNavModule,
        } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        export const IMPORTS = [SkyBlockquote, StacheNavModule];
      `);
    });

    it('should remove a multi-line import that only imports StacheBlockquoteModule', async () => {
      const result = await convertFile(stripIndent`
        import { Component } from '@angular/core';
        import {
          StacheBlockquoteModule,
        } from '${STACHE_PACKAGE}';

        export const IMPORTS = [StacheBlockquoteModule];
      `);

      expect(result).toEqual(stripIndent`
        import { Component } from '@angular/core';
        import { SkyBlockquote } from '@skyux/layout';

        export const IMPORTS = [SkyBlockquote];
      `);
    });

    it.each([
      ['first', ['StacheBlockquoteModule', 'CommonModule', 'FormsModule']],
      [
        'in the middle',
        ['CommonModule', 'StacheBlockquoteModule', 'FormsModule'],
      ],
      ['last', ['CommonModule', 'FormsModule', 'StacheBlockquoteModule']],
      ['alone', ['StacheBlockquoteModule']],
    ])(
      'should swap StacheBlockquoteModule %s in multi-line metadata arrays',
      async (_position, names) => {
        function toFile(moduleImport: string, moduleName: string): string {
          const array = (field: string): string[] => [
            `  ${field}: [`,
            ...names.map(
              (name) =>
                `    ${name === 'StacheBlockquoteModule' ? moduleName : name},`,
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
            `import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';`,
            'StacheBlockquoteModule',
          ),
        );

        expect(result).toEqual(
          toFile(
            `import { SkyBlockquote } from '@skyux/layout';`,
            'SkyBlockquote',
          ),
        );
      },
    );

    it('should add SkyBlockquote on its own line after StacheModule in multi-line arrays', async () => {
      const result = await convertFile(stripIndent`
        import { NgModule } from '@angular/core';
        import { StacheModule } from '${STACHE_PACKAGE}';

        @NgModule({
          imports: [
            CommonModule,
            StacheModule,
          ],
          exports: [
            StacheModule
          ],
        })
        export class FooModule {}
      `);

      expect(result).toEqual(stripIndent`
        import { NgModule } from '@angular/core';
        import { StacheModule } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        @NgModule({
          imports: [
            CommonModule,
            StacheModule,
            SkyBlockquote,
          ],
          exports: [
            StacheModule,
            SkyBlockquote
          ],
        })
        export class FooModule {}
      `);
    });

    it('should remove StacheBlockquoteModule first in a multi-line array that lists SkyBlockquote', async () => {
      const result = await convertFile(stripIndent`
        import { NgModule } from '@angular/core';
        import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        @NgModule({
          imports: [
            StacheBlockquoteModule,
            SkyBlockquote,
          ],
          exports: [
            StacheBlockquoteModule,
            SkyBlockquote,
          ],
        })
        export class FooModule {}
      `);

      expect(result).toEqual(stripIndent`
        import { NgModule } from '@angular/core';
        import { SkyBlockquote } from '@skyux/layout';

        @NgModule({
          imports: [
            SkyBlockquote,
          ],
          exports: [
            SkyBlockquote,
          ],
        })
        export class FooModule {}
      `);
    });

    it('should remove StacheBlockquoteModule in the middle of a multi-line TestBed array that lists SkyBlockquote', async () => {
      const result = await convertFile(stripIndent`
        import { TestBed } from '@angular/core/testing';
        import { StacheBlockquoteModule } from '${STACHE_PACKAGE}';
        import { SkyBlockquote } from '@skyux/layout';

        TestBed.configureTestingModule({
          imports: [
            SkyBlockquote,
            StacheBlockquoteModule,
            FooComponent,
          ],
        });
      `);

      expect(result).toEqual(stripIndent`
        import { TestBed } from '@angular/core/testing';
        import { SkyBlockquote } from '@skyux/layout';

        TestBed.configureTestingModule({
          imports: [
            SkyBlockquote,
            FooComponent,
          ],
        });
      `);
    });

    it('should not import SkyBlockquote again when a multi-line @skyux/layout import has it', async () => {
      const result = await convertFile(stripIndent`
        import { Component } from '@angular/core';
        import {
          StacheBlockquoteModule,
          StacheNavModule,
        } from '${STACHE_PACKAGE}';
        import {
          SkyBlockquote,
        } from '@skyux/layout';

        @Component({
          selector: 'app-foo',
          imports: [SkyBlockquote],
          template: '',
        })
        export class FooComponent {}

        @Component({
          selector: 'app-bar',
          imports: [
            StacheNavModule,
            StacheBlockquoteModule,
          ],
          template: '',
        })
        export class BarComponent {}
      `);

      expect(result).toEqual(stripIndent`
        import { Component } from '@angular/core';
        import {
          StacheNavModule,
        } from '${STACHE_PACKAGE}';
        import {
          SkyBlockquote,
        } from '@skyux/layout';

        @Component({
          selector: 'app-foo',
          imports: [SkyBlockquote],
          template: '',
        })
        export class FooComponent {}

        @Component({
          selector: 'app-bar',
          imports: [
            StacheNavModule,
            SkyBlockquote,
          ],
          template: '',
        })
        export class BarComponent {}
      `);
    });
  });
});
