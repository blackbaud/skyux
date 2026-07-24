import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp, createTestLibrary } from '../../../testing/scaffold';
import { JsonFile } from '../../../utility/json-file';

const COLLECTION_PATH = path.join(__dirname, '../../../../../migrations.json');
const SCHEMATIC_NAME = 'address-typescript-6-changes';

function runSchematic(tree: UnitTestTree): Promise<UnitTestTree> {
  const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);

  return runner.runSchematic(SCHEMATIC_NAME, {}, tree);
}

describe('address-typescript-6-changes', () => {
  it('should convert an implicit-baseUrl import, remove baseUrl, and rebase paths', async () => {
    const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);
    const tree = await createTestApp(runner, { projectName: 'test-app' });

    const tsconfig = new JsonFile(tree, '/tsconfig.json');
    tsconfig.modify(['compilerOptions', 'baseUrl'], './src');
    tsconfig.modify(['compilerOptions', 'paths'], {
      '@env/*': ['environments/*'],
    });

    tree.create('/src/app/shared.ts', 'export const shared = 1;');
    tree.create('/src/app/consumer.ts', `import { shared } from 'app/shared';`);

    const updatedTree = await runSchematic(tree);

    expect(updatedTree.readText('/src/app/consumer.ts')).toBe(
      `import { shared } from './shared';`,
    );
    expect(
      new JsonFile(updatedTree, '/tsconfig.json').get([
        'compilerOptions',
        'baseUrl',
      ]),
    ).toBeUndefined();
    expect(
      new JsonFile(updatedTree, '/tsconfig.json').get([
        'compilerOptions',
        'paths',
        '@env/*',
      ]),
    ).toEqual(['./src/environments/*']);
  });

  it('should convert an implicit-baseUrl import across a library project boundary', async () => {
    const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);
    const tree = await createTestLibrary(runner, { projectName: 'my-lib' });

    new JsonFile(tree, '/tsconfig.json').modify(
      ['compilerOptions', 'baseUrl'],
      './',
    );
    tree.create(
      '/projects/my-lib/src/lib/helper.ts',
      'export const helper = 1;',
    );
    tree.create(
      '/projects/my-lib/src/lib/consumer.ts',
      `import { helper } from 'projects/my-lib/src/lib/helper';`,
    );

    const updatedTree = await runSchematic(tree);

    expect(updatedTree.readText('/projects/my-lib/src/lib/consumer.ts')).toBe(
      `import { helper } from './helper';`,
    );
  });

  it('should convert a legacy "module Foo {}" namespace declaration', async () => {
    const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);
    const tree = await createTestApp(runner, { projectName: 'test-app' });

    tree.create('/src/app/legacy.ts', `module Foo {\n  export const x = 1;\n}`);

    const updatedTree = await runSchematic(tree);

    expect(updatedTree.readText('/src/app/legacy.ts')).toBe(
      `namespace Foo {\n  export const x = 1;\n}`,
    );
  });

  it('should remove deprecated compiler options', async () => {
    const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);
    const tree = await createTestApp(runner, { projectName: 'test-app' });

    new JsonFile(tree, '/tsconfig.json').modify(
      ['compilerOptions', 'downlevelIteration'],
      true,
    );

    const updatedTree = await runSchematic(tree);

    expect(
      new JsonFile(updatedTree, '/tsconfig.json').get([
        'compilerOptions',
        'downlevelIteration',
      ]),
    ).toBeUndefined();
  });

  it('should remove an empty "types" array from a freshly-scaffolded app', async () => {
    const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);
    const tree = await createTestApp(runner, { projectName: 'test-app' });

    expect(
      new JsonFile(tree, '/tsconfig.app.json').get([
        'compilerOptions',
        'types',
      ]),
    ).toEqual([]);

    const updatedTree = await runSchematic(tree);

    expect(
      new JsonFile(updatedTree, '/tsconfig.app.json').get([
        'compilerOptions',
        'types',
      ]),
    ).toBeUndefined();
  });

  it('should succeed on a freshly-scaffolded app with no baseUrl', async () => {
    const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);
    const tree = await createTestApp(runner, { projectName: 'test-app' });

    await expect(runSchematic(tree)).resolves.toBeInstanceOf(UnitTestTree);
  });
});
