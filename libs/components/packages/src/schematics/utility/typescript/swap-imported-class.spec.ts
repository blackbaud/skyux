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
    const content = `
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
    const content = `
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

    expect(tree.readText(path)).toBe(`
    import { A, D, C } from 'module';

    A(D) && C;`);
  });

  it('should avoid double importing classes', () => {
    const path = 'file.ts';
    const content = `
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

    expect(tree.readText(path)).toBe(`
    import { A,  C } from 'module';

    A(C) && C;`);
  });
});
