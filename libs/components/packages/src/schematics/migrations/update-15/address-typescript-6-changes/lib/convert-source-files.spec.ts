import { logging } from '@angular-devkit/core';
import { HostTree, SchematicContext } from '@angular-devkit/schematics';

import { convertSourceFiles } from './convert-source-files';
import { buildTsconfigModel } from './tsconfig-model';

function createContext(): {
  context: SchematicContext;
  warn: jest.SpyInstance;
} {
  const context: Pick<SchematicContext, 'logger'> = {
    logger: new logging.NullLogger(),
  };
  const warn = jest.spyOn(context.logger, 'warn');

  return { context: context as SchematicContext, warn };
}

function run(tree: HostTree, context: SchematicContext): void {
  const model = buildTsconfigModel(tree);
  convertSourceFiles(tree, model, context);
}

describe('convert-source-files', () => {
  describe('import conversion', () => {
    it('should convert a same-directory implicit-baseUrl import to relative', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/x.ts', 'export const x = 1;');
      tree.create('/src/app/y.ts', `import { x } from 'app/x';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(`import { x } from './x';`);
    });

    it('should convert a cross-directory implicit-baseUrl import to relative', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/shared/y.ts', 'export const y = 1;');
      tree.create('/src/app/x.ts', `import { y } from 'shared/y';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/x.ts')).toBe(
        `import { y } from '../shared/y';`,
      );
    });

    it('should resolve via a .d.ts candidate', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/x.d.ts', 'export declare const x: number;');
      tree.create('/src/app/y.ts', `import { x } from 'app/x';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(`import { x } from './x';`);
    });

    it('should resolve a directory import via an index.ts candidate and keep the directory form', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/shared/index.ts', 'export const shared = 1;');
      tree.create('/src/app/x.ts', `import { shared } from 'shared';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/x.ts')).toBe(
        `import { shared } from '../shared';`,
      );
    });

    it('should resolve a directory import via an index.d.ts candidate', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create(
        '/src/shared/index.d.ts',
        'export declare const shared: number;',
      );
      tree.create('/src/app/x.ts', `import { shared } from 'shared';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/x.ts')).toBe(
        `import { shared } from '../shared';`,
      );
    });

    it('should convert an export-from specifier', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/x.ts', 'export const x = 1;');
      tree.create('/src/app/y.ts', `export { x } from 'app/x';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(`export { x } from './x';`);
    });

    it('should convert a re-export-all specifier', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/x.ts', 'export const x = 1;');
      tree.create('/src/app/y.ts', `export * from 'app/x';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(`export * from './x';`);
    });

    it('should convert a dynamic import specifier', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/x.ts', 'export const x = 1;');
      tree.create('/src/app/y.ts', `const p = import('app/x');`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(`const p = import('./x');`);
    });

    it('should not touch a dynamic import with a non-literal argument', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/y.ts', `const p = import(someVar);`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(`const p = import(someVar);`);
    });

    it('should convert a "typeof import(...)" specifier', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/x.ts', 'export const x = 1;');
      tree.create('/src/app/y.ts', `type T = typeof import('app/x');`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(
        `type T = typeof import('./x');`,
      );
    });

    it('should convert an import-equals require specifier', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/x.ts', 'export = 1;');
      tree.create('/src/app/y.ts', `import x = require('app/x');`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(`import x = require('./x');`);
    });

    it('should not convert a specifier matching an exact paths alias', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: {
            baseUrl: './',
            paths: { '@app': ['src/app/index.ts'] },
          },
        }),
      );
      tree.create('/src/app/index.ts', 'export const x = 1;');
      tree.create('/src/app/y.ts', `import { x } from '@app';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(`import { x } from '@app';`);
    });

    it('should not convert a specifier matching a wildcard paths alias', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({
          compilerOptions: {
            baseUrl: './',
            paths: { '@app/*': ['src/app/*'] },
          },
        }),
      );
      tree.create('/src/app/x.ts', 'export const x = 1;');
      tree.create('/src/app/y.ts', `import { x } from '@app/x';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(
        `import { x } from '@app/x';`,
      );
    });

    it('should not touch a specifier that has no baseUrl candidate (npm package)', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create(
        '/src/app/y.ts',
        `import { Component } from '@angular/core';`,
      );

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(
        `import { Component } from '@angular/core';`,
      );
    });

    it('should not touch an already-relative specifier', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/x.ts', 'export const x = 1;');
      tree.create('/src/app/y.ts', `import { x } from './x';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(`import { x } from './x';`);
    });

    it('should not touch a rooted specifier', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.json',
        JSON.stringify({ compilerOptions: { baseUrl: './src' } }),
      );
      tree.create('/src/app/y.ts', `import { x } from '/absolute/x';`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(
        `import { x } from '/absolute/x';`,
      );
    });

    it('should leave every source file byte-identical when no config defines a baseUrl', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      const content = `import { Component } from '@angular/core';\nimport { x } from 'app/x';`;
      tree.create('/src/app/y.ts', content);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/src/app/y.ts')).toBe(content);
    });

    it('should warn once per directory when configs disagree on the effective baseUrl', () => {
      const tree = new HostTree();
      tree.create(
        '/tsconfig.a.json',
        JSON.stringify({ compilerOptions: { baseUrl: './a' } }),
      );
      tree.create(
        '/tsconfig.b.json',
        JSON.stringify({ compilerOptions: { baseUrl: './b' } }),
      );
      tree.create('/y.ts', `import { x } from '@angular/core';`);
      tree.create('/z.ts', `import { x } from '@angular/core';`);

      const { context, warn } = createContext();
      run(tree, context);

      expect(warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('module to namespace conversion', () => {
    it('should convert "module Foo {}" to "namespace Foo {}"', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      tree.create('/y.ts', `module Foo {\n  export const x = 1;\n}`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/y.ts')).toBe(
        `namespace Foo {\n  export const x = 1;\n}`,
      );
    });

    it('should convert "declare module Foo {}" preserving "declare"', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      tree.create('/y.ts', `declare module Foo {\n  const x: number;\n}`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/y.ts')).toBe(
        `declare namespace Foo {\n  const x: number;\n}`,
      );
    });

    it('should convert "export module Foo {}"', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      tree.create('/y.ts', `export module Foo {\n  export const x = 1;\n}`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/y.ts')).toBe(
        `export namespace Foo {\n  export const x = 1;\n}`,
      );
    });

    it('should leave "namespace Foo {}" untouched', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      const content = `namespace Foo {\n  export const x = 1;\n}`;
      tree.create('/y.ts', content);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/y.ts')).toBe(content);
    });

    it('should leave an ambient string-named module declaration untouched', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      const content = `declare module 'some-package' {\n  export const x: number;\n}`;
      tree.create('/y.ts', content);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/y.ts')).toBe(content);
    });

    it('should leave "declare global {}" untouched', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      const content = `declare global {\n  interface Window {}\n}`;
      tree.create('/y.ts', content);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/y.ts')).toBe(content);
    });

    it('should only replace the outer keyword of a dotted module declaration', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      tree.create('/y.ts', `module A.B {\n  export const x = 1;\n}`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/y.ts')).toBe(
        `namespace A.B {\n  export const x = 1;\n}`,
      );
    });

    it('should convert a module declaration nested inside another module declaration', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      tree.create(
        '/y.ts',
        `module Outer {\n  module Inner {\n    export const x = 1;\n  }\n}`,
      );

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/y.ts')).toBe(
        `namespace Outer {\n  namespace Inner {\n    export const x = 1;\n  }\n}`,
      );
    });

    it('should leave a sibling namespace declaration untouched when a module declaration triggers parsing', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      tree.create('/y.ts', `module Foo {}\nnamespace Bar {}`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/y.ts')).toBe(`namespace Foo {}\nnamespace Bar {}`);
    });

    it('should convert a module declaration inside a .d.ts file', () => {
      const tree = new HostTree();
      tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: {} }));
      tree.create('/y.d.ts', `declare module Foo {\n  const x: number;\n}`);

      const { context } = createContext();
      run(tree, context);

      expect(tree.readText('/y.d.ts')).toBe(
        `declare namespace Foo {\n  const x: number;\n}`,
      );
    });
  });
});
