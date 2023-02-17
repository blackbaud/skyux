import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

const IMPORT = `import`;

describe('fix imports', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../migration-collection.json')
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });
    const runSchematicAsync = async () =>
      runner.runSchematic('fix-imports', {}, tree);
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
    const angularJson = tree.readJson('angular.json') as { projects: any };
    expect(angularJson).toHaveProperty('projects.my-app.sourceRoot');
    const project = angularJson.projects['my-app'];
    delete project.sourceRoot;
    tree.overwrite('angular.json', JSON.stringify(angularJson));
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
      import { Aaa } from './Aaa';
      import { C } from './path/c';
      import { D } from './Path/D';
      import { Main } from './path/';
      import { NonExistent } from './non';
      export class B extends A {}`
    );
    tree.create('/src/a.ts', `export class A {}`);
    tree.create('/src/aaa.ts', `export class Aaa {}`);
    tree.create('/src/Path/C.ts', `export class C {}`);
    tree.create('/src/Path/d.ts', `export class D {}`);
    tree.create('/src/Path/index.ts', `export class Main {}`);
    tree.create(
      '/src/Path/With/Layers/e.ts',
      `
      import { Main } from '../../../path/';
      import { C } from '../../c';
      export class E extends Main {}
    `
    );
    await runSchematicAsync();
    expect(tree.readText('/src/index.ts')).toEqual(
      `import { A } from './a';
      import { Aaa } from './aaa';
      import { C } from './Path/C';
      import { D } from './Path/d';
      import { Main } from './Path/';
      import { NonExistent } from './non';
      export class B extends A {}`
    );
    expect(tree.readText('/src/Path/With/Layers/e.ts')).toEqual(`
      import { Main } from '../../';
      import { C } from '../../C';
      export class E extends Main {}
    `);
  });

  it('should change export paths that are incorrect', async () => {
    const { tree, runSchematicAsync } = await setupTest();
    tree.create(
      '/src/index.ts',
      `export * from './A';
      export { C as Sea } from './path/c';
      export * from './Path/D';
      const value = 1;
      export { value };
      export * from './non';`
    );
    tree.create('/src/a.ts', `export class A {}`);
    tree.create('/src/Path/C.ts', `export class C {}`);
    tree.create('/src/Path/d.ts', `export class D {}`);
    await runSchematicAsync();
    expect(tree.readText('/src/index.ts')).toEqual(
      `export * from './a';
      export { C as Sea } from './Path/C';
      export * from './Path/d';
      const value = 1;
      export { value };
      export * from './non';`
    );
  });

  it('should remove unnecessary core-js imports', async () => {
    const { tree, runSchematicAsync } = await setupTest();
    tree.create(
      '/src/mod.ts',
      `${IMPORT} { setTimeout } from 'core-js';
      ${IMPORT} values from 'core-js/features/object/values';

      const corejs = {
        values: values,
      };
      const corejs2 = {
        values: require('core-js/library/fn/object/values'),
      };`
    );
    tree.create(
      '/src/polyfill.ts',
      [
        `// This is a polyfill for IE11.`,
        ``,
        `${IMPORT} 'core-js/es6';`,
        `${IMPORT} 'core-js/es7/reflect';`,
        `${IMPORT} 'zone.js/dist/zone';`,
        `${IMPORT} 'ts-helpers';`,
        ``,
        `// Add global to window, assigning the value of window itself.`,
        `(window as any).global = window;`,
      ].join(`\n`)
    );
    await runSchematicAsync();
    expect(tree.readText('/src/mod.ts').trim()).toEqual(
      `const corejs = {
        values: Object.values,
      };
      const corejs2 = {
        values: Object.values,
      };`
    );
    expect(tree.readText('/src/polyfill.ts')).toEqual(
      [
        `// This is a polyfill for IE11.`,
        ``,
        `// ${IMPORT} 'core-js/es6';`,
        `// ${IMPORT} 'core-js/es7/reflect';`,
        `${IMPORT} 'zone.js/dist/zone';`,
        `${IMPORT} 'ts-helpers';`,
        ``,
        `// Add global to window, assigning the value of window itself.`,
        `(window as any).global = window;`,
      ].join(`\n`)
    );
  });
});
