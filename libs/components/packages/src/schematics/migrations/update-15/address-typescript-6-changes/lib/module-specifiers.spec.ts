import ts from 'typescript';

import { findModuleSpecifiers, matchesPathsPattern } from './module-specifiers';

function parse(content: string): ts.SourceFile {
  return ts.createSourceFile('test.ts', content, ts.ScriptTarget.Latest, true);
}

function findSpecifierTexts(content: string): string[] {
  return findModuleSpecifiers(parse(content)).map((node) => node.text);
}

describe('module-specifiers', () => {
  describe('findModuleSpecifiers', () => {
    it('should find an import declaration specifier', () => {
      expect(findSpecifierTexts(`import { X } from 'app/x';`)).toEqual([
        'app/x',
      ]);
    });

    it('should find an export-from declaration specifier', () => {
      expect(findSpecifierTexts(`export { X } from 'app/x';`)).toEqual([
        'app/x',
      ]);
    });

    it('should find a re-export-all specifier', () => {
      expect(findSpecifierTexts(`export * from 'app/x';`)).toEqual(['app/x']);
    });

    it('should not error on an export declaration without a module specifier', () => {
      expect(findSpecifierTexts(`const x = 1; export { x };`)).toEqual([]);
    });

    it('should find a dynamic import specifier', () => {
      expect(findSpecifierTexts(`const p = import('app/x');`)).toEqual([
        'app/x',
      ]);
    });

    it('should not find a dynamic import with a non-literal argument', () => {
      expect(findSpecifierTexts(`const p = import(someVar);`)).toEqual([]);
    });

    it('should not find a bare require() call', () => {
      expect(findSpecifierTexts(`const x = require('app/x');`)).toEqual([]);
    });

    it('should find a "typeof import(...)" specifier', () => {
      expect(findSpecifierTexts(`type X = typeof import('app/x');`)).toEqual([
        'app/x',
      ]);
    });

    it('should find an "import(...).Qualifier" type specifier', () => {
      expect(findSpecifierTexts(`type X = import('app/x').Foo;`)).toEqual([
        'app/x',
      ]);
    });

    it('should find an import-equals require specifier', () => {
      expect(findSpecifierTexts(`import x = require('app/x');`)).toEqual([
        'app/x',
      ]);
    });

    it('should not find the name of an ambient string-named module declaration', () => {
      expect(findSpecifierTexts(`declare module 'app/x' {}`)).toEqual([]);
    });

    it('should find multiple specifiers in one file', () => {
      expect(
        findSpecifierTexts(`
          import { A } from 'app/a';
          import { B } from 'app/b';
        `),
      ).toEqual(['app/a', 'app/b']);
    });
  });

  describe('matchesPathsPattern', () => {
    it('should match an exact pattern', () => {
      expect(matchesPathsPattern('@app', ['@app'])).toBe(true);
    });

    it('should not match a different exact pattern', () => {
      expect(matchesPathsPattern('@app', ['@lib'])).toBe(false);
    });

    it('should match a wildcard prefix pattern', () => {
      expect(matchesPathsPattern('@app/foo/bar', ['@app/*'])).toBe(true);
    });

    it('should not match when the wildcard prefix does not match', () => {
      expect(matchesPathsPattern('@lib/foo', ['@app/*'])).toBe(false);
    });

    it('should match a wildcard pattern with a suffix', () => {
      expect(matchesPathsPattern('bar/foo', ['*/foo'])).toBe(true);
    });

    it('should return false when there are no patterns', () => {
      expect(matchesPathsPattern('@app/foo', [])).toBe(false);
    });

    it('should return true when any of multiple patterns match', () => {
      expect(matchesPathsPattern('@lib/foo', ['@app/*', '@lib/*'])).toBe(true);
    });
  });
});
