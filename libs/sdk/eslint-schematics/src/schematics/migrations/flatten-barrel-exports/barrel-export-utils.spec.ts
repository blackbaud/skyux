import { HostTree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';

import {
  buildNamedExportStatement,
  extractNamedExports,
  findWildcardReExports,
  resolveInTree,
  topologicalSort,
} from './barrel-export-utils';

describe('extractNamedExports', () => {
  it('should extract value and type exports', () => {
    const content = ['export class Foo {}', 'export interface Bar {}'].join(
      '\n',
    );

    expect(extractNamedExports(content)).toEqual({
      valueExports: ['Foo'],
      typeExports: ['Bar'],
      hasWildcardReExports: false,
    });
  });

  it('should detect wildcard re-exports', () => {
    expect(extractNamedExports("export * from './bar';")).toEqual({
      valueExports: [],
      typeExports: [],
      hasWildcardReExports: true,
    });
  });

  it('should detect wildcard re-exports alongside named exports', () => {
    const content = ['export class Foo {}', "export * from './bar';"].join(
      '\n',
    );

    expect(extractNamedExports(content)).toEqual({
      valueExports: ['Foo'],
      typeExports: [],
      hasWildcardReExports: true,
    });
  });

  it('should not flag namespace re-exports as wildcards', () => {
    expect(extractNamedExports("export * as ns from './bar';")).toEqual({
      valueExports: [],
      typeExports: [],
      hasWildcardReExports: false,
    });
  });

  it('should extract function exports', () => {
    expect(extractNamedExports('export function foo() {}')).toEqual({
      valueExports: ['foo'],
      typeExports: [],
      hasWildcardReExports: false,
    });
  });

  it('should extract enum exports', () => {
    expect(extractNamedExports('export enum Color { Red }')).toEqual({
      valueExports: ['Color'],
      typeExports: [],
      hasWildcardReExports: false,
    });
  });

  it('should extract type alias exports', () => {
    expect(extractNamedExports('export type ID = string;')).toEqual({
      valueExports: [],
      typeExports: ['ID'],
      hasWildcardReExports: false,
    });
  });

  it('should extract type-only re-exports', () => {
    expect(extractNamedExports("export type { Foo } from './foo';")).toEqual({
      valueExports: [],
      typeExports: ['Foo'],
      hasWildcardReExports: false,
    });
  });
});

describe('findWildcardReExports', () => {
  it('should find bare wildcard re-exports', () => {
    const content = "export * from './foo';";
    const results = findWildcardReExports(content);

    expect(results).toHaveLength(1);
    expect(results[0].specifier).toBe('./foo');
  });

  it('should find multiple wildcard re-exports', () => {
    const content = ["export * from './foo';", "export * from './bar';"].join(
      '\n',
    );
    const results = findWildcardReExports(content);

    expect(results).toHaveLength(2);
    expect(results[0].specifier).toBe('./foo');
    expect(results[1].specifier).toBe('./bar');
  });

  it('should not include namespace re-exports', () => {
    const content = "export * as ns from './foo';";
    expect(findWildcardReExports(content)).toHaveLength(0);
  });

  it('should not include named re-exports', () => {
    const content = "export { Foo } from './foo';";
    expect(findWildcardReExports(content)).toHaveLength(0);
  });

  it('should return correct start and end offsets', () => {
    const content = "export * from './foo';";
    const results = findWildcardReExports(content);

    expect(content.slice(results[0].start, results[0].end)).toBe(
      "export * from './foo';",
    );
  });
});

describe('resolveInTree', () => {
  let tree: UnitTestTree;

  beforeEach(() => {
    tree = new UnitTestTree(new HostTree());
  });

  it('should resolve a .ts file', () => {
    tree.create('/src/foo.ts', 'export class Foo {}');

    expect(resolveInTree(tree, '/src/index.ts', './foo')).toBe('/src/foo.ts');
  });

  it('should resolve an index.ts file', () => {
    tree.create('/src/bar/index.ts', 'export class Bar {}');

    expect(resolveInTree(tree, '/src/index.ts', './bar')).toBe(
      '/src/bar/index.ts',
    );
  });

  it('should return undefined for non-existent module', () => {
    expect(
      resolveInTree(tree, '/src/index.ts', './nonexistent'),
    ).toBeUndefined();
  });

  it('should return undefined for non-relative specifiers', () => {
    expect(
      resolveInTree(tree, '/src/index.ts', 'some-package'),
    ).toBeUndefined();
  });

  it('should prefer .ts over index.ts', () => {
    tree.create('/src/foo.ts', 'export class Foo {}');
    tree.create('/src/foo/index.ts', 'export class FooIndex {}');

    expect(resolveInTree(tree, '/src/index.ts', './foo')).toBe('/src/foo.ts');
  });
});

describe('buildNamedExportStatement', () => {
  it('should build value export statement', () => {
    const result = buildNamedExportStatement(
      {
        valueExports: ['Foo', 'Bar'],
        typeExports: [],
        hasWildcardReExports: false,
      },
      './foo',
    );

    expect(result).toBe("export { Foo, Bar } from './foo';");
  });

  it('should build type export statement', () => {
    const result = buildNamedExportStatement(
      { valueExports: [], typeExports: ['Foo'], hasWildcardReExports: false },
      './foo',
    );

    expect(result).toBe("export type { Foo } from './foo';");
  });

  it('should build mixed export statements', () => {
    const result = buildNamedExportStatement(
      {
        valueExports: ['FooComponent'],
        typeExports: ['FooConfig'],
        hasWildcardReExports: false,
      },
      './foo',
    );

    expect(result).toBe(
      "export { FooComponent } from './foo';\nexport type { FooConfig } from './foo';",
    );
  });
});

describe('topologicalSort', () => {
  it('should return leaf nodes first', () => {
    const graph = new Map<string, string[]>();
    graph.set('/a.ts', ['/b.ts']);
    graph.set('/b.ts', []);

    const sorted = topologicalSort(graph);

    expect(sorted.indexOf('/b.ts')).toBeLessThan(sorted.indexOf('/a.ts'));
  });

  it('should handle multi-level chains', () => {
    const graph = new Map<string, string[]>();
    graph.set('/index.ts', ['/a.ts']);
    graph.set('/a.ts', ['/b.ts']);
    graph.set('/b.ts', []);

    const sorted = topologicalSort(graph);

    expect(sorted.indexOf('/b.ts')).toBeLessThan(sorted.indexOf('/a.ts'));
    expect(sorted.indexOf('/a.ts')).toBeLessThan(sorted.indexOf('/index.ts'));
  });

  it('should handle circular dependencies without crashing', () => {
    const graph = new Map<string, string[]>();
    graph.set('/a.ts', ['/b.ts']);
    graph.set('/b.ts', ['/a.ts']);

    const sorted = topologicalSort(graph);

    expect(sorted).toHaveLength(2);
    expect(sorted).toContain('/a.ts');
    expect(sorted).toContain('/b.ts');
  });

  it('should handle independent nodes', () => {
    const graph = new Map<string, string[]>();
    graph.set('/a.ts', []);
    graph.set('/b.ts', []);

    const sorted = topologicalSort(graph);

    expect(sorted).toHaveLength(2);
  });

  it('should handle deps pointing outside the graph', () => {
    const graph = new Map<string, string[]>();
    graph.set('/a.ts', ['/external.ts']);

    const sorted = topologicalSort(graph);

    expect(sorted).toContain('/a.ts');
  });
});
