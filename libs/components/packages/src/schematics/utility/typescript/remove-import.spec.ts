import { Tree } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { removeImport } from './remove-import';

describe('remove-import', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = Tree.empty();
  });

  it('should remove one class', async () => {
    const path = 'file.ts';
    const content = `import { A, B, C } from 'module';`;
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );
    removeImport(tree, path, sourceFile, {
      classNames: ['B'],
      moduleName: 'module',
    });
    expect(tree.readText(path)).toBe(`import { A,  C } from 'module';`);
  });

  it('should remove every class', async () => {
    const path = 'file.ts';
    const content = `import { A, B, C } from 'module';`;
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );
    removeImport(tree, path, sourceFile, {
      classNames: ['A', 'B', 'C'],
      moduleName: 'module',
    });
    expect(tree.readText(path)).toBe('');
  });
});
