import { Tree } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { removeImport } from './remove-import';

describe('remove-import', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = Tree.empty();
  });

  it('should remove one class', () => {
    const path = 'file.ts';
    const content = `import { A, B, C } from 'module';`;
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );
    const recorder = tree.beginUpdate(path);
    removeImport(recorder, sourceFile, {
      classNames: ['B'],
      moduleName: 'module',
    });
    tree.commitUpdate(recorder);
    expect(tree.readText(path)).toBe(`import { A,  C } from 'module';`);
  });

  it('should remove every class', () => {
    const path = 'file.ts';
    const content = `import { A, B, C } from 'module';`;
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );
    const recorder = tree.beginUpdate(path);
    removeImport(recorder, sourceFile, {
      classNames: ['A', 'B', 'C'],
      moduleName: 'module',
    });
    tree.commitUpdate(recorder);
    expect(tree.readText(path)).toBe('');
  });
});
