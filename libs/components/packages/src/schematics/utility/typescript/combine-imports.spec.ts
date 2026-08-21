import { Tree } from '@angular-devkit/schematics';
import ts from 'typescript';

import { combineImports } from './combine-imports';

describe('combine-imports', () => {
  function run(content: string): string {
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

    combineImports(recorder, sourceFile, 'module');
    tree.commitUpdate(recorder);

    return tree.readText(path);
  }

  it('should merge declarations into the first one', () => {
    expect(
      run(
        `import { A } from 'module';\nimport { B } from 'other';\nimport { C } from 'module';\n`,
      ),
    ).toBe(`import { A, C } from 'module';\nimport { B } from 'other';\n`);
  });

  it('should drop a specifier that is imported more than once', () => {
    expect(
      run(`import { A } from 'module';\nimport { A, B } from 'module';\n`),
    ).toBe(`import { A, B } from 'module';\n`);
  });

  it('should keep the declaration type-only when every declaration is', () => {
    expect(
      run(
        `import type { A } from 'module';\nimport type { B } from 'module';\n`,
      ),
    ).toBe(`import type { A, B } from 'module';\n`);
  });

  it('should move the type modifier onto the specifiers when mixing imports', () => {
    expect(
      run(`import type { A } from 'module';\nimport { B } from 'module';\n`),
    ).toBe(`import { type A, B } from 'module';\n`);
  });

  it('should prefer the value import when a name is imported as both', () => {
    expect(
      run(`import type { A } from 'module';\nimport { A, B } from 'module';\n`),
    ).toBe(`import { A, B } from 'module';\n`);
  });

  it('should leave declarations with a default binding alone', () => {
    const content = `import Def, { A } from 'module';\nimport { B } from 'module';\n`;

    expect(run(content)).toBe(content);
  });

  it('should leave a single declaration alone', () => {
    const content = `import { A } from 'module';\n`;

    expect(run(content)).toBe(content);
  });
});
