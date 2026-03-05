import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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
    mkdirSync(dir);
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

    expect(getNamedExportsFromFile(filePath)).toEqual({
      valueExports: ['Foo', 'bar'],
      typeExports: [],
    });
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
    expect(extractNamedExports('export class Foo {}')).toEqual({
      valueExports: ['Foo'],
      typeExports: [],
    });
  });

  it('should extract abstract class exports', () => {
    expect(extractNamedExports('export abstract class Foo {}')).toEqual({
      valueExports: ['Foo'],
      typeExports: [],
    });
  });

  it('should extract interface exports as type-only', () => {
    expect(extractNamedExports('export interface Foo {}')).toEqual({
      valueExports: [],
      typeExports: ['Foo'],
    });
  });

  it('should extract type alias exports as type-only', () => {
    expect(extractNamedExports('export type Foo = string;')).toEqual({
      valueExports: [],
      typeExports: ['Foo'],
    });
  });

  it('should extract function exports', () => {
    expect(extractNamedExports('export function foo() {}')).toEqual({
      valueExports: ['foo'],
      typeExports: [],
    });
  });

  it('should extract async function exports', () => {
    expect(extractNamedExports('export async function foo() {}')).toEqual({
      valueExports: ['foo'],
      typeExports: [],
    });
  });

  it('should extract const exports', () => {
    expect(extractNamedExports('export const foo = 1;')).toEqual({
      valueExports: ['foo'],
      typeExports: [],
    });
  });

  it('should extract let exports', () => {
    expect(extractNamedExports('export let foo = 1;')).toEqual({
      valueExports: ['foo'],
      typeExports: [],
    });
  });

  it('should extract var exports', () => {
    expect(extractNamedExports('export var foo = 1;')).toEqual({
      valueExports: ['foo'],
      typeExports: [],
    });
  });

  it('should extract enum exports', () => {
    expect(extractNamedExports('export enum Foo { A, B }')).toEqual({
      valueExports: ['Foo'],
      typeExports: [],
    });
  });

  it('should extract declare const exports as value exports', () => {
    expect(extractNamedExports('export declare const foo: string;')).toEqual({
      valueExports: ['foo'],
      typeExports: [],
    });
  });

  it('should extract multi-declarator variable exports', () => {
    expect(extractNamedExports('export const a = 1, b = 2;')).toEqual({
      valueExports: ['a', 'b'],
      typeExports: [],
    });
  });

  it('should extract named re-exports as value exports', () => {
    expect(extractNamedExports("export { Foo, Bar } from './foo';")).toEqual({
      valueExports: ['Bar', 'Foo'],
      typeExports: [],
    });
  });

  it('should extract aliased re-exports using the alias name', () => {
    expect(extractNamedExports("export { Foo as Bar } from './foo';")).toEqual({
      valueExports: ['Bar'],
      typeExports: [],
    });
  });

  it('should extract type-only named re-exports (export type { })', () => {
    expect(
      extractNamedExports("export type { Foo, Bar } from './foo';"),
    ).toEqual({ valueExports: [], typeExports: ['Bar', 'Foo'] });
  });

  it('should extract inline type specifiers in export { type Foo, Bar }', () => {
    expect(
      extractNamedExports("export { type Foo, Bar } from './foo';"),
    ).toEqual({ valueExports: ['Bar'], typeExports: ['Foo'] });
  });

  it('should handle empty specifiers from trailing commas gracefully', () => {
    expect(extractNamedExports("export { Foo, } from './foo';")).toEqual({
      valueExports: ['Foo'],
      typeExports: [],
    });
  });

  it('should deduplicate exports', () => {
    const content = [
      'export class Foo {}',
      "export { Foo } from './other';",
    ].join('\n');
    expect(extractNamedExports(content)).toEqual({
      valueExports: ['Foo'],
      typeExports: [],
    });
  });

  it('should sort exports alphabetically', () => {
    const content = [
      'export class Zebra {}',
      'export class Alpha {}',
      'export class Middle {}',
    ].join('\n');
    expect(extractNamedExports(content)).toEqual({
      valueExports: ['Alpha', 'Middle', 'Zebra'],
      typeExports: [],
    });
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
    expect(extractNamedExports(content)).toEqual({
      valueExports: ['BarService', 'FOO_TOKEN', 'FooComponent', 'FooEnum'],
      typeExports: ['FooConfig', 'FooType'],
    });
  });

  it('should return empty arrays for file with no exports', () => {
    expect(extractNamedExports('const foo = 1;')).toEqual({
      valueExports: [],
      typeExports: [],
    });
  });

  it('should not extract default exports', () => {
    expect(extractNamedExports('export default class Foo {}')).toEqual({
      valueExports: [],
      typeExports: [],
    });
  });

  it('should not extract exports from comments', () => {
    expect(extractNamedExports('// export class Fake {}')).toEqual({
      valueExports: [],
      typeExports: [],
    });
  });

  it('should not extract exports from string literals', () => {
    expect(extractNamedExports('const s = "export class Fake {}";')).toEqual({
      valueExports: [],
      typeExports: [],
    });
  });

  it('should extract aliased type re-exports using the alias name', () => {
    expect(
      extractNamedExports("export type { Foo as Bar } from './foo';"),
    ).toEqual({ valueExports: [], typeExports: ['Bar'] });
  });

  it('should handle multi-line export specifiers', () => {
    expect(
      extractNamedExports("export {\n  Foo,\n  Bar\n} from './foo';"),
    ).toEqual({
      valueExports: ['Bar', 'Foo'],
      typeExports: [],
    });
  });
});
