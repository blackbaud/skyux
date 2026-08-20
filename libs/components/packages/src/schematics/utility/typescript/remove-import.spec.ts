import { Tree } from '@angular-devkit/schematics';
import ts from 'typescript';

import { removeImport } from './remove-import';

describe('remove-import', () => {
  function run(content: string, classNames: string[]): string {
    const path = 'file.ts';
    const tree = Tree.empty();
    tree.create(path, content);

    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );
    const recorder = tree.beginUpdate(path);

    removeImport(recorder, sourceFile, { classNames, moduleName: 'module' });
    tree.commitUpdate(recorder);

    return tree.readText(path);
  }

  it('should remove one class', () => {
    expect(run(`import { A, B, C } from 'module';`, ['B'])).toBe(
      `import { A, C } from 'module';`,
    );
  });

  it('should remove the first class', () => {
    expect(run(`import { A, B, C } from 'module';`, ['A'])).toBe(
      `import { B, C } from 'module';`,
    );
  });

  it('should remove adjacent classes', () => {
    expect(run(`import { A, B, C } from 'module';`, ['A', 'B'])).toBe(
      `import { C } from 'module';`,
    );
  });

  it('should remove classes on either side of a retained class', () => {
    expect(run(`import { A, B, C } from 'module';`, ['A', 'C'])).toBe(
      `import { B } from 'module';`,
    );
  });

  it('should remove every class', () => {
    expect(run(`import { A, B, C } from 'module';`, ['A', 'B', 'C'])).toBe('');
  });

  it('should remove the line the statement ends on', () => {
    expect(
      run(`import { A } from 'module';\n\nconst value = 1;\n`, ['A']),
    ).toBe('\nconst value = 1;\n');
  });

  it('should ignore imports of other modules', () => {
    const content = `import { A } from 'other-module';`;

    expect(run(content, ['A'])).toBe(content);
  });

  it('should ignore namespace imports', () => {
    const content = `import * as A from 'module';`;

    expect(run(content, ['A'])).toBe(content);
  });
});
