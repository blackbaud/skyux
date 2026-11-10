import {
  stripIndent,
  stripIndents,
} from '@angular-devkit/core/src/utils/literals';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { createTestApp, createTestLibrary } from '../../testing/scaffold';

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

  it('should use the local name of an aliased SkyCode import', async () => {
    const result = await convertFile(stripIndents`
      import { Component } from '@angular/core';
      import { SkyCodeModule } from '${STACHE_PACKAGE}';
      import { SkyCode as SkyUxCode } from '@skyux/code';

      @Component({
        selector: 'app-foo',
        imports: [SkyUxCode, SkyCodeModule],
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
      import { SkyCode as SkyUxCode } from '@skyux/code';

      @Component({
        selector: 'app-foo',
        imports: [SkyUxCode],
        template: '',
      })
      export class FooComponent {}

      @Component({
        selector: 'app-bar',
        imports: [SkyUxCode],
        template: '',
      })
      export class BarComponent {}
    `);
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

  it('should warn and skip a namespace import of the Stache package', async () => {
    const content = stripIndents`
      import * as stache from '${STACHE_PACKAGE}';

      export const IMPORTS = [stache.SkyCodeModule];
    `;
    const tree = await setup({ 'src/app/namespace.ts': content });
    const packageJson = tree.readText('package.json');

    const result = await convert(tree);

    expect(result.readText('src/app/namespace.ts')).toEqual(content);
    expect(result.readText('package.json')).toEqual(packageJson);
    expect(warnings).toEqual([
      `"/src/app/namespace.ts" uses "SkyCodeModule" from "${STACHE_PACKAGE}" through an alias, a namespace import or a re-export, which this schematic does not convert. Replace it with "SkyCode" from "@skyux/code" manually.`,
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

  describe('library package.json', () => {
    const LIBRARY_PACKAGE_JSON = 'projects/test-lib/package.json';

    async function setupLibrary(
      sections: Record<string, Record<string, string>>,
      files: Record<string, string>,
    ): Promise<UnitTestTree> {
      const tree = await createTestLibrary(runner, { projectName: 'test-lib' });
      const rootPackageJson = JSON.parse(tree.readText('package.json'));
      rootPackageJson.dependencies[STACHE_PACKAGE] = '12.0.0';
      tree.overwrite('package.json', JSON.stringify(rootPackageJson, null, 2));

      const packageJson = JSON.parse(tree.readText(LIBRARY_PACKAGE_JSON));
      for (const [section, dependencies] of Object.entries(sections)) {
        packageJson[section] = { ...packageJson[section], ...dependencies };
      }
      tree.overwrite(
        LIBRARY_PACKAGE_JSON,
        JSON.stringify(packageJson, null, 2),
      );

      for (const [filePath, content] of Object.entries(files)) {
        tree.create(`projects/test-lib/src/lib/${filePath}`, content);
      }

      return tree;
    }

    /**
     * Runs the schematic twice, so every spec also checks that a second run
     * leaves the library's `package.json` as the first run left it.
     */
    async function convertLibrary(tree: UnitTestTree): Promise<{
      dependencies: Record<string, string>;
      peerDependencies: Record<string, string>;
    }> {
      const run = (input: UnitTestTree): Promise<UnitTestTree> =>
        runner.runSchematic(
          'convert-stache-code-to-code',
          { project: 'test-lib' },
          input,
        );
      const once = await run(tree);
      const onceContent = once.readText(LIBRARY_PACKAGE_JSON);
      const twice = await run(once);

      expect(twice.readText(LIBRARY_PACKAGE_JSON)).toEqual(onceContent);

      return JSON.parse(onceContent);
    }

    const codeModuleUsage = stripIndents`
      import { SkyCodeModule } from '${STACHE_PACKAGE}';

      export const IMPORTS = [SkyCodeModule];
    `;

    it('should swap Stache for @skyux/code in peerDependencies', async () => {
      const tree = await setupLibrary(
        { peerDependencies: { [STACHE_PACKAGE]: '^12.0.0' } },
        { 'foo.ts': codeModuleUsage },
      );
      const expectedPeers = {
        ...JSON.parse(tree.readText(LIBRARY_PACKAGE_JSON)).peerDependencies,
        '@skyux/code': '0.0.0-PLACEHOLDER',
      };
      delete expectedPeers[STACHE_PACKAGE];

      const { peerDependencies } = await convertLibrary(tree);

      expect(peerDependencies).toEqual(expectedPeers);
    });

    it('should swap Stache for @skyux/code in dependencies', async () => {
      const tree = await setupLibrary(
        { dependencies: { [STACHE_PACKAGE]: '12.0.0' } },
        { 'foo.ts': codeModuleUsage },
      );
      const expectedDependencies = {
        ...JSON.parse(tree.readText(LIBRARY_PACKAGE_JSON)).dependencies,
        '@skyux/code': '0.0.0-PLACEHOLDER',
      };
      delete expectedDependencies[STACHE_PACKAGE];

      const { dependencies, peerDependencies } = await convertLibrary(tree);

      expect(dependencies).toEqual(expectedDependencies);
      expect(peerDependencies['@skyux/code']).toBeUndefined();
    });

    it('should keep Stache and add @skyux/code when the library still uses Stache', async () => {
      const tree = await setupLibrary(
        { peerDependencies: { [STACHE_PACKAGE]: '^12.0.0' } },
        {
          'foo.ts': codeModuleUsage,
          'bar.ts': stripIndents`
            import { SkyCodeBlockModule } from '${STACHE_PACKAGE}';

            export const BAR_IMPORTS = [SkyCodeBlockModule];
          `,
        },
      );
      const originalPeers = JSON.parse(
        tree.readText(LIBRARY_PACKAGE_JSON),
      ).peerDependencies;

      const { peerDependencies } = await convertLibrary(tree);

      expect(peerDependencies).toEqual({
        ...originalPeers,
        '@skyux/code': '0.0.0-PLACEHOLDER',
      });
    });

    it('should not change a library package.json that does not list Stache', async () => {
      const tree = await setupLibrary({}, { 'foo.ts': codeModuleUsage });
      const packageJson = tree.readText(LIBRARY_PACKAGE_JSON);

      const result = await runner.runSchematic(
        'convert-stache-code-to-code',
        { project: 'test-lib' },
        tree,
      );

      expect(result.readText(LIBRARY_PACKAGE_JSON)).toEqual(packageJson);
    });
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
