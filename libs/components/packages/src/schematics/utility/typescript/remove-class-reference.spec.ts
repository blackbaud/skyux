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

  it('should remove the last entry in a decorator imports array and import', () => {
    const content = `import { SkyListViewGridModule, SkyGridModule } from 'module';\n\n@Component({\n  imports: [SkyListViewGridModule, SkyGridModule],\n})\nclass Test {}`;
    expect(run(content)).toBe(
      `import { SkyListViewGridModule, } from 'module';\n\n@Component({\n  imports: [SkyListViewGridModule],\n})\nclass Test {}`,
    );
  });

  it('should remove the first entry in a decorator imports array and import', () => {
    const content = `import { SkyGridModule, SkyListViewGridModule } from 'module';\n\n@Component({\n  imports: [SkyGridModule, SkyListViewGridModule],\n})\nclass Test {}`;
    expect(run(content)).toBe(
      `import {  SkyListViewGridModule } from 'module';\n\n@Component({\n  imports: [SkyListViewGridModule],\n})\nclass Test {}`,
    );
  });

  it('should leave an empty array when it is the only entry', () => {
    const content = `import { SkyGridModule } from 'module';\n\n@Component({\n  imports: [SkyGridModule],\n})\nclass Test {}`;
    expect(run(content)).toBe(
      `\n\n@Component({\n  imports: [],\n})\nclass Test {}`,
    );
  });

  it('should only remove the matching class from the import statement', () => {
    const content = `import { SkyGridModule, SkyGridComponent } from 'module';\n\n@Component({\n  imports: [SkyGridModule],\n})\nclass Test {}`;
    expect(run(content)).toBe(
      `import {  SkyGridComponent } from 'module';\n\n@Component({\n  imports: [],\n})\nclass Test {}`,
    );
  });

  it('should leave a direct non-array reference and its import untouched', () => {
    const content = `import { SkyGridModule } from 'module';\n\nconst mod = SkyGridModule;`;
    expect(run(content)).toBe(content);
  });

  it('should not modify an unrelated array that references the class name', () => {
    const content = `import { SkyGridModule } from 'module';\n\nconst other = [SkyGridModule];\n\n@Component({\n  imports: [SkyGridModule],\n})\nclass Test {}`;
    expect(run(content)).toBe(
      `import { SkyGridModule } from 'module';\n\nconst other = [SkyGridModule];\n\n@Component({\n  imports: [],\n})\nclass Test {}`,
    );
  });

  it('should not modify a reference shadowed by a parameter', () => {
    const content = `import { SkyGridModule } from 'module';\n\nfunction makeConfig(SkyGridModule) {\n  return { imports: [SkyGridModule] };\n}\n\n@Component({\n  imports: [SkyGridModule],\n})\nclass Test {}`;
    expect(run(content)).toBe(
      `import { SkyGridModule } from 'module';\n\nfunction makeConfig(SkyGridModule) {\n  return { imports: [SkyGridModule] };\n}\n\n@Component({\n  imports: [],\n})\nclass Test {}`,
    );
  });

  it('should not modify an imports array passed to a plain function call', () => {
    const content = `import { SkyGridModule } from 'module';\n\nconst config = makeConfig({\n  imports: [SkyGridModule],\n});\n\n@Component({\n  imports: [SkyGridModule],\n})\nclass Test {}`;
    expect(run(content)).toBe(
      `import { SkyGridModule } from 'module';\n\nconst config = makeConfig({\n  imports: [SkyGridModule],\n});\n\n@Component({\n  imports: [],\n})\nclass Test {}`,
    );
  });

  it('should return whether the import was removed', () => {
    function runReturning(path: string, content: string): boolean {
      tree.create(path, content);
      const sourceFile = ts.createSourceFile(
        path,
        content,
        ts.ScriptTarget.Latest,
        true,
      );
      const recorder = tree.beginUpdate(path);
      const removed = removeClassReference(
        recorder,
        sourceFile,
        'SkyGridModule',
        'module',
      );
      tree.commitUpdate(recorder);
      return removed;
    }

    expect(
      runReturning(
        'removed.ts',
        `import { SkyGridModule } from 'module';\n\n@Component({\n  imports: [SkyGridModule],\n})\nclass Test {}`,
      ),
    ).toBe(true);
    expect(
      runReturning(
        'kept.ts',
        `import { SkyGridModule } from 'module';\n\nconst mod = SkyGridModule;`,
      ),
    ).toBe(false);
  });
});
