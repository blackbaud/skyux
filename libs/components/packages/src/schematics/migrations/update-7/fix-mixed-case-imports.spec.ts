import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

describe('fix mixed case imports', () => {
  let tree: Tree;
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
    tree = Tree.empty();
    tree.create('/angular.json', JSON.stringify(angularJson));
  }

  it('should not change import paths that are correct', async () => {
    setupTest();
    tree.create('/index.ts', `import { A } from './a';`);
    tree.create('/a.ts', `export class A {}`);
    tree.create('/empty.ts', ``);
    await runner
      .runSchematicAsync('fix-mixed-case-imports', {}, tree)
      .toPromise();
    expect(tree.readText('/index.ts')).toBe(`import { A } from './a';`);
  });

  it('should update import paths with backslashes', async () => {
    setupTest();
    tree.create('/windows.ts', "import { A } from '.\\a';");
    tree.create('/a.ts', `export class A {}`);
    await runner
      .runSchematicAsync('fix-mixed-case-imports', {}, tree)
      .toPromise();
    expect(tree.readText('/windows.ts')).toBe(`import { A } from './a';\n`);
  });

  it('should change import paths that are incorrect', async () => {
    setupTest();
    tree.create(
      '/index.ts',
      [
        `import { A } from './A';`,
        `import { C } from './path/c';`,
        `import { D } from './Path/D';`,
        `import { NonExistent } from './non';`,
        `export class B extends A {`,
        `}`,
        '',
      ].join(`\n`)
    );
    tree.create('/a.ts', `export class A {}`);
    tree.create('/Path/C.ts', `export class C {}`);
    tree.create('/Path/d.ts', `export class D {}`);
    await runner
      .runSchematicAsync('fix-mixed-case-imports', {}, tree)
      .toPromise();
    expect(tree.readText('/index.ts')).toMatchSnapshot();
  });
});
