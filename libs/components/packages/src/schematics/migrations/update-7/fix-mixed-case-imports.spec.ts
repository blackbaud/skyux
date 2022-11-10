import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

describe('fix mixed case imports', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../migration-collection.json')
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });
    const runSchematicAsync = async () =>
      runner.runSchematicAsync('fix-mixed-case-imports', {}, tree).toPromise();
    return { tree, runSchematicAsync };
  }

  it('should not change import paths that are correct', async () => {
    const { tree, runSchematicAsync } = await setupTest();
    tree.create('/src/index.ts', `import { A } from './a';`);
    tree.create('/src/a.ts', `export class A {}`);
    tree.create('/src/empty.ts', ``);
    await runSchematicAsync();
    expect(tree.readText('/src/index.ts')).toBe(`import { A } from './a';`);
  });

  it('should update import paths with backslashes', async () => {
    const { tree, runSchematicAsync } = await setupTest();
    tree.create('/src/windows.ts', "import { A } from '.\\a';");
    tree.create('/src/a.ts', `export class A {}`);
    await runSchematicAsync();
    expect(tree.readText('/src/windows.ts')).toBe(`import { A } from './a';`);
  });

  it('should change import paths that are incorrect', async () => {
    const { tree, runSchematicAsync } = await setupTest();
    tree.create(
      '/src/index.ts',
      `import { A } from './A';
      import { C } from './path/c';
      import { D } from './Path/D';
      import { NonExistent } from './non';
      export class B extends A {}`
    );
    tree.create('/src/a.ts', `export class A {}`);
    tree.create('/src/Path/C.ts', `export class C {}`);
    tree.create('/src/Path/d.ts', `export class D {}`);
    await runSchematicAsync();
    expect(tree.readText('/src/index.ts')).toEqual(
      `import { A } from './a';
      import { C } from './Path/C';
      import { D } from './Path/d';
      import { NonExistent } from './non';
      export class B extends A {}`
    );
  });
});
