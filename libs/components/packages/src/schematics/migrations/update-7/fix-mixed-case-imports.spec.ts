import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

describe('fix mixed case imports', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../migration-collection.json')
  );
  const angularJson = {
    version: 1,
    projects: {
      test: {
        projectType: 'application',
        root: '',
        architect: {},
      },
    },
  };

  function setupTest() {
    const tree = Tree.empty();
    tree.create('/angular.json', JSON.stringify(angularJson));
    const runSchematicAsync = async () =>
      runner.runSchematicAsync('fix-mixed-case-imports', {}, tree).toPromise();
    return { tree, runSchematicAsync };
  }

  it('should not change import paths that are correct', async () => {
    const { tree, runSchematicAsync } = setupTest();
    tree.create('/index.ts', `import { A } from './a';`);
    tree.create('/a.ts', `export class A {}`);
    tree.create('/empty.ts', ``);
    await runSchematicAsync();
    expect(tree.readText('/index.ts')).toBe(`import { A } from './a';`);
  });

  it('should update import paths with backslashes', async () => {
    const { tree, runSchematicAsync } = setupTest();
    tree.create('/windows.ts', "import { A } from '.\\a';");
    tree.create('/a.ts', `export class A {}`);
    await runSchematicAsync();
    expect(tree.readText('/windows.ts')).toBe(`import { A } from './a';`);
  });

  it('should change import paths that are incorrect', async () => {
    const { tree, runSchematicAsync } = setupTest();
    tree.create(
      '/index.ts',
      `import { A } from './A';
      import { C } from './path/c';
      import { D } from './Path/D';
      import { NonExistent } from './non';
      export class B extends A {}`
    );
    tree.create('/a.ts', `export class A {}`);
    tree.create('/Path/C.ts', `export class C {}`);
    tree.create('/Path/d.ts', `export class D {}`);
    await runSchematicAsync();
    expect(tree.readText('/index.ts')).toEqual(
      `import { A } from './a';
      import { C } from './Path/C';
      import { D } from './Path/d';
      import { NonExistent } from './non';
      export class B extends A {}`
    );
  });
});
