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

  it('should only swap SkyCodeModule in the component that renders sky-code', async () => {
    const tree = await setup({
      'src/app/code.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-code',
          imports: [SkyCodeModule],
          templateUrl: './code.component.html',
        })
        export class CodeComponent {}
      `,
      'src/app/code.component.html': '<sky-code>foo</sky-code>',
      'src/app/plain.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-plain',
          imports: [SkyCodeModule],
          template: '<p>No code</p>',
        })
        export class PlainComponent {}
      `,
    });

    const result = await convert(tree);

    expect(result.readText('src/app/code.component.ts')).toContain(
      'imports: [SkyCode]',
    );
    // The unused Stache module is removed rather than swapped.
    expect(result.readText('src/app/plain.component.ts')).toEqual(stripIndents`
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-plain',
        imports: [],
        template: '<p>No code</p>',
      })
      export class PlainComponent {}
    `);
    expect(getDependencies(result)[STACHE_PACKAGE]).toBeUndefined();
  });

  it('should leave package.json alone when no component renders sky-code', async () => {
    const tree = await setup({
      'src/app/plain.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-plain',
          imports: [SkyCodeModule],
          template: '<p>No code</p>',
        })
        export class PlainComponent {}
      `,
    });
    const packageJson = tree.readText('package.json');

    const result = await convert(tree);

    expect(result.readText('src/app/plain.component.ts')).not.toContain(
      'SkyCode',
    );
    expect(result.readText('package.json')).toEqual(packageJson);
  });

  it('should keep other Stache imports and the Stache dependency', async () => {
    const tree = await setup({
      'src/app/foo.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeBlockModule, SkyCodeModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-foo',
          imports: [SkyCodeBlockModule, SkyCodeModule],
          template: '<sky-code>foo</sky-code>',
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
        template: '<sky-code>foo</sky-code>',
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
          template: '<sky-code>foo</sky-code>',
        })
        export class FooComponent {}
      `,
      'src/app/bar.component.ts': stripIndents`
        import { Component } from '@angular/core';
        import { SkyCodeBlockModule } from '${STACHE_PACKAGE}';

        @Component({
          selector: 'app-bar',
          imports: [SkyCodeBlockModule],
          template: '<sky-code>foo</sky-code>',
        })
        export class BarComponent {}
      `,
    });
    const barContent = tree.readText('src/app/bar.component.ts');

    const result = await convert(tree);

    expect(result.readText('src/app/bar.component.ts')).toEqual(barContent);
    expect(getDependencies(result)[STACHE_PACKAGE]).toEqual('12.0.0');
  });

  it('should keep the Stache dependency when a file outside sourceRoot imports it', async () => {
    const tree = await setup({
      'src/app/foo.ts': stripIndents`
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        export const IMPORTS = [SkyCodeModule];
      `,
      'e2e/fixtures.ts': stripIndents`
        import { SkyCodeBlockModule } from '${STACHE_PACKAGE}';

        export const E2E_IMPORTS = [SkyCodeBlockModule];
      `,
    });

    const result = await convert(tree);

    expect(getDependencies(result)[STACHE_PACKAGE]).toEqual('12.0.0');
  });

  it('should warn and skip an aliased SkyCodeModule import', async () => {
    const content = stripIndents`
      import { SkyCodeModule as StacheCode } from '${STACHE_PACKAGE}';

      export const IMPORTS = [StacheCode];
    `;
    const tree = await setup({ 'src/app/aliased.ts': content });
    const packageJson = tree.readText('package.json');

    const result = await convert(tree);

    expect(result.readText('src/app/aliased.ts')).toEqual(content);
    expect(result.readText('package.json')).toEqual(packageJson);
    expect(warnings).toEqual([
      `"/src/app/aliased.ts" uses "SkyCodeModule" from "${STACHE_PACKAGE}" through an alias, a namespace import or a re-export, which this schematic does not convert. Replace it with "SkyCode" from "@skyux/code" manually.`,
    ]);
  });

  it('should warn about a re-export and keep the Stache dependency', async () => {
    const barrel = `export { SkyCodeModule } from '${STACHE_PACKAGE}';`;
    const tree = await setup({
      'src/app/index.ts': barrel,
      'src/app/foo.ts': stripIndents`
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        export const IMPORTS = [SkyCodeModule];
      `,
    });

    const result = await convert(tree);

    expect(result.readText('src/app/index.ts')).toEqual(barrel);
    expect(result.readText('src/app/foo.ts')).toEqual(stripIndents`
      import { SkyCode } from '@skyux/code';

      export const IMPORTS = [SkyCode];
    `);
    expect(getDependencies(result)[STACHE_PACKAGE]).toEqual('12.0.0');
    expect(warnings).toEqual([
      `"/src/app/index.ts" uses "SkyCodeModule" from "${STACHE_PACKAGE}" through an alias, a namespace import or a re-export, which this schematic does not convert. Replace it with "SkyCode" from "@skyux/code" manually.`,
    ]);
  });

  it('should not add @skyux/code to dependencies when it is a dev dependency', async () => {
    const tree = await setup({
      'src/app/foo.ts': stripIndents`
        import { SkyCodeModule } from '${STACHE_PACKAGE}';

        export const IMPORTS = [SkyCodeModule];
      `,
    });
    const packageJson = JSON.parse(tree.readText('package.json'));
    packageJson.devDependencies['@skyux/code'] = '15.8.0';
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    const result = await convert(tree);
    const { dependencies, devDependencies } = JSON.parse(
      result.readText('package.json'),
    );

    expect(dependencies['@skyux/code']).toBeUndefined();
    expect(devDependencies['@skyux/code']).toEqual('15.8.0');
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
          template: '<sky-code>foo</sky-code>',
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
            template: '<sky-code>foo</sky-code>',
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
});
