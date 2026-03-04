import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  extractNamedExports,
  getNamedExportsFromFile,
  resolveModulePath,
} from './resolve-exports';

describe('resolveModulePath', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'resolve-exports-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true });
  });

  it('should resolve a .ts file', () => {
    const filePath = join(tempDir, 'foo.ts');
    writeFileSync(filePath, 'export class Foo {}');

    const result = resolveModulePath(join(tempDir, 'index.ts'), './foo');
    expect(result).toBe(filePath);
  });

  it('should resolve an index.ts file', () => {
    const dir = join(tempDir, 'bar');
    const filePath = join(dir, 'index.ts');
    require('node:fs').mkdirSync(dir);
    writeFileSync(filePath, 'export class Bar {}');

    const result = resolveModulePath(join(tempDir, 'index.ts'), './bar');
    expect(result).toBe(filePath);
  });

  it('should return undefined for non-existent module', () => {
    const result = resolveModulePath(
      join(tempDir, 'index.ts'),
      './nonexistent',
    );
    expect(result).toBeUndefined();
  });
});

describe('getNamedExportsFromFile', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'resolve-exports-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true });
  });

  it('should return named exports from a file', () => {
    const filePath = join(tempDir, 'foo.ts');
    writeFileSync(filePath, 'export class Foo {}\nexport const bar = 1;');

    expect(getNamedExportsFromFile(filePath)).toEqual(['Foo', 'bar']);
  });

  it('should return undefined for a file with no exports', () => {
    const filePath = join(tempDir, 'empty.ts');
    writeFileSync(filePath, 'const foo = 1;');

    expect(getNamedExportsFromFile(filePath)).toBeUndefined();
  });

  it('should return undefined for a non-existent file', () => {
    expect(
      getNamedExportsFromFile(join(tempDir, 'missing.ts')),
    ).toBeUndefined();
  });
});

describe('extractNamedExports', () => {
  it('should extract class exports', () => {
    expect(extractNamedExports('export class Foo {}')).toEqual(['Foo']);
  });

  it('should extract abstract class exports', () => {
    expect(extractNamedExports('export abstract class Foo {}')).toEqual([
      'Foo',
    ]);
  });

  it('should extract interface exports', () => {
    expect(extractNamedExports('export interface Foo {}')).toEqual(['Foo']);
  });

  it('should extract type exports', () => {
    expect(extractNamedExports('export type Foo = string;')).toEqual(['Foo']);
  });

  it('should extract function exports', () => {
    expect(extractNamedExports('export function foo() {}')).toEqual(['foo']);
  });

  it('should extract async function exports', () => {
    expect(extractNamedExports('export async function foo() {}')).toEqual([
      'foo',
    ]);
  });

  it('should extract const exports', () => {
    expect(extractNamedExports('export const foo = 1;')).toEqual(['foo']);
  });

  it('should extract let exports', () => {
    expect(extractNamedExports('export let foo = 1;')).toEqual(['foo']);
  });

  it('should extract var exports', () => {
    expect(extractNamedExports('export var foo = 1;')).toEqual(['foo']);
  });

  it('should extract enum exports', () => {
    expect(extractNamedExports('export enum Foo { A, B }')).toEqual(['Foo']);
  });

  it('should extract declare exports', () => {
    expect(extractNamedExports('export declare const foo: string;')).toEqual([
      'foo',
    ]);
  });

  it('should extract named re-exports', () => {
    expect(
      extractNamedExports("export { Foo, Bar } from './foo';"),
    ).toEqual(['Bar', 'Foo']);
  });

  it('should extract aliased re-exports using the alias name', () => {
    expect(
      extractNamedExports("export { Foo as Bar } from './foo';"),
    ).toEqual(['Bar']);
  });

  it('should deduplicate exports', () => {
    const content = [
      'export class Foo {}',
      "export { Foo } from './other';",
    ].join('\n');
    expect(extractNamedExports(content)).toEqual(['Foo']);
  });

  it('should sort exports alphabetically', () => {
    const content = [
      'export class Zebra {}',
      'export class Alpha {}',
      'export class Middle {}',
    ].join('\n');
    expect(extractNamedExports(content)).toEqual([
      'Alpha',
      'Middle',
      'Zebra',
    ]);
  });

  it('should extract multiple export types from a single file', () => {
    const content = [
      'export class FooComponent {}',
      'export interface FooConfig {}',
      'export type FooType = string;',
      'export const FOO_TOKEN = new InjectionToken();',
      'export enum FooEnum { A }',
      "export { BarService } from './bar';",
    ].join('\n');
    expect(extractNamedExports(content)).toEqual([
      'BarService',
      'FOO_TOKEN',
      'FooComponent',
      'FooConfig',
      'FooEnum',
      'FooType',
    ]);
  });

  it('should return empty array for file with no exports', () => {
    expect(extractNamedExports('const foo = 1;')).toEqual([]);
  });

  it('should not extract default exports', () => {
    expect(extractNamedExports('export default class Foo {}')).toEqual([]);
  });
});
