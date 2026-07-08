import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { Tree } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { swapImportedClass } from './swap-imported-class';

describe('swap-imported-class', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = Tree.empty();
  });

  it('should do nothing if not applicable', () => {
    const path = 'file.ts';
    const content = stripIndents`
    import { A, B, C } from 'module';

    A(B) && C;`;
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );

    const recorder = tree.beginUpdate(path);
    swapImportedClass(recorder, path, sourceFile, [
      {
        classNames: { D: 'E' },
        moduleName: 'other-module',
      },
    ]);
    tree.commitUpdate(recorder);

    expect(tree.readText(path)).toBe(content);
  });

  it('should swap imported classes', () => {
    const path = 'file.ts';
    const content = stripIndents`
    import { A, B, C } from 'module';

    A(B) && C;`;
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );

    const recorder = tree.beginUpdate(path);
    swapImportedClass(recorder, path, sourceFile, [
      {
        classNames: { B: 'D' },
        moduleName: 'module',
      },
    ]);
    tree.commitUpdate(recorder);

    expect(tree.readText(path)).toBe(stripIndents`
    import { A, D, C } from 'module';

    A(D) && C;`);
  });

  it('should swap imported classes from different modules', () => {
    const path = 'file.ts';
    const content = stripIndents`
    import { B } from 'old-module';

    A(B) && C;`;
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );

    const recorder = tree.beginUpdate(path);
    swapImportedClass(recorder, path, sourceFile, [
      {
        classNames: { B: 'D' },
        moduleName: {
          old: 'old-module',
          new: 'new-module',
        },
      },
    ]);
    tree.commitUpdate(recorder);

    expect(tree.readText(path)).toBe(
      `\n` +
        stripIndents`
    import { D } from 'new-module';

    A(D) && C;`,
    );
  });

  it('should partially swap imported classes from different modules', () => {
    const path = 'file.ts';
    const content = stripIndents`
    import { A, B, C } from 'old-module';

    A(B) && C;
    console.log(B);`;
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );

    const recorder = tree.beginUpdate(path);
    swapImportedClass(recorder, path, sourceFile, [
      {
        classNames: { B: 'D' },
        moduleName: {
          old: 'old-module',
          new: 'new-module',
        },
        filter: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
      },
    ]);
    tree.commitUpdate(recorder);

    expect(tree.readText(path)).toBe(
      stripIndents`
      import { A, B, C } from 'old-module';
      import { D } from 'new-module';

      A(D) && C;
      console.log(B);`,
    );
  });

  it('should not duplicate a class name that is already imported when swapping to an array of class names', () => {
    const path = 'file.ts';
    const content = stripIndents`
    import { SkyDataGrid } from 'new-module';
    import { B } from 'old-module';

    A(B) && SkyDataGrid;`;
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );

    const recorder = tree.beginUpdate(path);
    swapImportedClass(recorder, path, sourceFile, [
      {
        classNames: { B: ['SkyDataGrid', 'SkyDataGridColumn'] },
        moduleName: {
          old: 'old-module',
          new: 'new-module',
        },
      },
    ]);
    tree.commitUpdate(recorder);

    expect(tree.readText(path)).toBe(
      stripIndents`
      import { SkyDataGrid, SkyDataGridColumn } from 'new-module';` +
        `\n\n\n` +
        stripIndents`
      A(SkyDataGrid, SkyDataGridColumn) && SkyDataGrid;`,
    );
  });

  it('should avoid double importing classes', () => {
    const path = 'file.ts';
    const content = stripIndents`
    import { A, B, C } from 'module';

    A(B) && C;`;
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );

    const recorder = tree.beginUpdate(path);
    swapImportedClass(recorder, path, sourceFile, [
      {
        classNames: { B: 'C' },
        moduleName: 'module',
      },
    ]);
    tree.commitUpdate(recorder);

    expect(tree.readText(path)).toBe(stripIndents`
    import { A,  C } from 'module';

    A(C) && C;`);
  });
});
