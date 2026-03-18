import { HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

const MIGRATIONS_PATH = path.resolve(__dirname, '../../../../migrations.json');

describe('flatten-barrel-exports migration', () => {
  let runner: SchematicTestRunner;

  beforeEach(() => {
    runner = new SchematicTestRunner('migrations', MIGRATIONS_PATH);
  });

  async function runMigration(tree: UnitTestTree): Promise<UnitTestTree> {
    return await runner.runSchematic('flatten-barrel-exports', {}, tree);
  }

  it('should flatten a single-level barrel export', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/src/foo.ts', 'export class Foo {}\nexport const bar = 1;');
    tree.create('/src/index.ts', "export * from './foo';");

    const result = await runMigration(tree);

    expect(result.readText('/src/index.ts')).toBe(
      "export { Foo, bar } from './foo';",
    );
  });

  it('should flatten a two-level cascade', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/src/leaf.ts', 'export class Leaf {}');
    tree.create('/src/mid.ts', "export * from './leaf';");
    tree.create('/src/index.ts', "export * from './mid';");

    const result = await runMigration(tree);

    expect(result.readText('/src/mid.ts')).toBe(
      "export { Leaf } from './leaf';",
    );
    expect(result.readText('/src/index.ts')).toBe(
      "export { Leaf } from './mid';",
    );
  });

  it('should handle mixed named and wildcard exports', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/src/foo.ts', 'export class Foo {}');
    tree.create(
      '/src/index.ts',
      "export const LOCAL = 1;\nexport * from './foo';",
    );

    const result = await runMigration(tree);

    expect(result.readText('/src/index.ts')).toBe(
      "export const LOCAL = 1;\nexport { Foo } from './foo';",
    );
  });

  it('should handle value and type exports', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create(
      '/src/foo.ts',
      'export class FooComponent {}\nexport interface FooConfig {}',
    );
    tree.create('/src/index.ts', "export * from './foo';");

    const result = await runMigration(tree);

    expect(result.readText('/src/index.ts')).toBe(
      "export { FooComponent } from './foo';\nexport type { FooConfig } from './foo';",
    );
  });

  it('should skip circular dependencies without crashing', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/src/a.ts', "export * from './b';");
    tree.create('/src/b.ts', "export * from './a';");

    const result = await runMigration(tree);

    // Both files should be unchanged since they form a cycle.
    expect(result.readText('/src/a.ts')).toBe("export * from './b';");
    expect(result.readText('/src/b.ts')).toBe("export * from './a';");
  });

  it('should skip unresolvable specifiers', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/src/index.ts', "export * from 'some-package';");

    const result = await runMigration(tree);

    expect(result.readText('/src/index.ts')).toBe(
      "export * from 'some-package';",
    );
  });

  it('should skip namespace re-exports', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/src/foo.ts', 'export class Foo {}');
    tree.create('/src/index.ts', "export * as ns from './foo';");

    const result = await runMigration(tree);

    // Namespace re-exports are not bare wildcards, so findWildcardReExports
    // ignores them and the file stays unchanged.
    expect(result.readText('/src/index.ts')).toBe(
      "export * as ns from './foo';",
    );
  });

  it('should skip files in node_modules', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/node_modules/pkg/index.ts', "export * from './internal';");
    tree.create('/node_modules/pkg/internal.ts', 'export class Internal {}');

    const result = await runMigration(tree);

    expect(result.readText('/node_modules/pkg/index.ts')).toBe(
      "export * from './internal';",
    );
  });

  it('should handle multiple wildcard exports in one file', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/src/foo.ts', 'export class Foo {}');
    tree.create('/src/bar.ts', 'export class Bar {}');
    tree.create(
      '/src/index.ts',
      "export * from './foo';\nexport * from './bar';",
    );

    const result = await runMigration(tree);

    expect(result.readText('/src/index.ts')).toBe(
      "export { Foo } from './foo';\nexport { Bar } from './bar';",
    );
  });

  it('should do nothing when no barrel exports exist', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/src/index.ts', "export { Foo } from './foo';");
    tree.create('/src/foo.ts', 'export class Foo {}');

    const result = await runMigration(tree);

    expect(result.readText('/src/index.ts')).toBe(
      "export { Foo } from './foo';",
    );
  });

  it('should resolve index.ts files', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/src/foo/index.ts', 'export class Foo {}');
    tree.create('/src/index.ts', "export * from './foo';");

    const result = await runMigration(tree);

    expect(result.readText('/src/index.ts')).toBe(
      "export { Foo } from './foo';",
    );
  });

  it('should skip targets with no exports', async () => {
    const tree = new UnitTestTree(new HostTree());
    tree.create('/src/empty.ts', 'const internal = 1;');
    tree.create('/src/index.ts', "export * from './empty';");

    const result = await runMigration(tree);

    expect(result.readText('/src/index.ts')).toBe("export * from './empty';");
  });
});
