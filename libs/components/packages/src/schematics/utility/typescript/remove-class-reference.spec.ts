import { Tree } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { removeClassReference } from './remove-class-reference';

describe('remove-class-reference', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = Tree.empty();
  });

  function run(content: string): string {
    const path = 'file.ts';
    tree.create(path, content);
    const sourceFile = ts.createSourceFile(
      path,
      content,
      ts.ScriptTarget.Latest,
      true,
    );
    const recorder = tree.beginUpdate(path);
    removeClassReference(recorder, sourceFile, 'SkyGridModule', 'module');
    tree.commitUpdate(recorder);
    return tree.readText(path);
  }

  it('should remove the last entry in an array and import', () => {
    const content = `import { SkyListViewGridModule, SkyGridModule } from 'module';\n\nconst x = [SkyListViewGridModule, SkyGridModule];`;
    expect(run(content)).toBe(
      `import { SkyListViewGridModule, } from 'module';\n\nconst x = [SkyListViewGridModule];`,
    );
  });

  it('should remove the first entry in an array and import', () => {
    const content = `import { SkyGridModule, SkyListViewGridModule } from 'module';\n\nconst x = [SkyGridModule, SkyListViewGridModule];`;
    expect(run(content)).toBe(
      `import {  SkyListViewGridModule } from 'module';\n\nconst x = [SkyListViewGridModule];`,
    );
  });

  it('should leave an empty array when it is the only entry', () => {
    const content = `import { SkyGridModule } from 'module';\n\nconst x = [SkyGridModule];`;
    expect(run(content)).toBe(`\n\nconst x = [];`);
  });

  it('should only remove the matching class from the import statement', () => {
    const content = `import { SkyGridModule, SkyGridComponent } from 'module';\n\nconst x = [SkyGridModule];`;
    expect(run(content)).toBe(
      `import {  SkyGridComponent } from 'module';\n\nconst x = [];`,
    );
  });

  it('should leave a direct non-array reference and its import untouched', () => {
    const content = `import { SkyGridModule } from 'module';\n\nconst mod = SkyGridModule;`;
    expect(run(content)).toBe(content);
  });
});
