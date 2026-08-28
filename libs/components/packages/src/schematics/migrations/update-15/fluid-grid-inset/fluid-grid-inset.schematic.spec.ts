import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import path from 'node:path';

describe('fluid-grid-inset.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
  );

  function setupTree(files: Record<string, string>): Tree {
    const tree = Tree.empty();
    tree.create(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          app: {
            projectType: 'application',
            root: '',
            architect: {},
          },
          lib: {
            projectType: 'library',
            root: 'projects/lib',
            sourceRoot: 'projects/lib/src',
            architect: {},
          },
        },
      }),
    );
    for (const [filePath, content] of Object.entries(files)) {
      tree.create(filePath, content);
    }
    return tree;
  }

  async function runSchematic(tree: Tree): Promise<void> {
    await runner.runSchematic('fluid-grid-inset', {}, tree);
  }

  it('should remove a bound literal `true` value', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid gutterSize="medium" [disableMargin]="true">
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-fluid-grid gutterSize="medium">
  <sky-row></sky-row>
</sky-fluid-grid>`);
  });

  it('should remove a static `true` value', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid disableMargin="true">
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html')).toBe(`<sky-fluid-grid>
  <sky-row></sky-row>
</sky-fluid-grid>`);
  });

  it('should replace a bare static attribute with `inset="true"`', async () => {
    // A bare attribute binds the empty string, which is falsy -- the same
    // as never setting `disableMargin` at all -- so the margin was shown.
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid disableMargin>
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-fluid-grid inset="true">
  <sky-row></sky-row>
</sky-fluid-grid>`);
  });

  it('should replace a bound literal `false` value with `[inset]="true"`', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid [disableMargin]="false">
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-fluid-grid [inset]="true">
  <sky-row></sky-row>
</sky-fluid-grid>`);
  });

  it('should remove a static `false` value, since it is a truthy string', async () => {
    // Without brackets, `disableMargin="false"` binds the literal string
    // "false", which is truthy -- the same as `disableMargin="true"`.
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid disableMargin="false">
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html')).toBe(`<sky-fluid-grid>
  <sky-row></sky-row>
</sky-fluid-grid>`);
  });

  it('should migrate both attributes when an element sets the static and bound attribute', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid disableMargin [disableMargin]="false">
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-fluid-grid inset="true" [inset]="true">
  <sky-row></sky-row>
</sky-fluid-grid>`);
  });

  it('should invert and rename a dynamic binding', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid [disableMargin]="hideMargin">
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-fluid-grid [inset]="!(hideMargin)">
  <sky-row></sky-row>
</sky-fluid-grid>`);
  });

  it('should quote the inverted binding with single quotes when the expression contains a double quote', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid [disableMargin]='x === "foo"'>
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-fluid-grid [inset]='!(x === "foo")'>
  <sky-row></sky-row>
</sky-fluid-grid>`);
  });

  it('should entity-encode double quotes when the expression contains both quote characters', async () => {
    // The source uses &quot; to embed a literal double quote inside a
    // double-quoted attribute; parse5 decodes it to `x === "foo" || y !== 'bar'`.
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid [disableMargin]="x === &quot;foo&quot; || y !== 'bar'"></sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html')).toBe(
      `<sky-fluid-grid [inset]="!(x === &quot;foo&quot; || y !== 'bar')"></sky-fluid-grid>`,
    );
  });

  it('should migrate the long-form bind-disableMargin syntax', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid bind-disableMargin="hideMargin">
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-fluid-grid [inset]="!(hideMargin)">
  <sky-row></sky-row>
</sky-fluid-grid>`);
  });

  it('should remove a literal-true bind-disableMargin attribute', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid bind-disableMargin="true"></sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html')).toBe(
      `<sky-fluid-grid></sky-fluid-grid>`,
    );
  });

  it('should not change an element that does not set disableMargin', async () => {
    const template = `<sky-fluid-grid>
  <sky-row></sky-row>
</sky-fluid-grid>`;
    const tree = setupTree({
      '/src/app/test.component.html': template,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html')).toBe(template);
  });

  it('should not warn for an element that already sets a static inset attribute', async () => {
    const warnSpy = jest.fn();
    const template = `<sky-fluid-grid inset="true"></sky-fluid-grid>`;
    const tree = setupTree({
      '/src/app/test.component.html': template,
    });

    runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnSpy(entry.message);
      }
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html')).toBe(template);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should not warn for an element that already sets a bound inset attribute', async () => {
    const warnSpy = jest.fn();
    const template = `<sky-fluid-grid [inset]="condition"></sky-fluid-grid>`;
    const tree = setupTree({
      '/src/app/test.component.html': template,
    });

    runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnSpy(entry.message);
      }
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html')).toBe(template);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should migrate multiple elements within the same template', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid [disableMargin]="true"></sky-fluid-grid>
<sky-fluid-grid [disableMargin]="false"></sky-fluid-grid>
<sky-fluid-grid></sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html')).toBe(
      `<sky-fluid-grid></sky-fluid-grid>
<sky-fluid-grid [inset]="true"></sky-fluid-grid>
<sky-fluid-grid></sky-fluid-grid>`,
    );
  });

  it('should migrate the attribute from inline templates', async () => {
    const tree = setupTree({
      '/src/app/test.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: \`<sky-fluid-grid [disableMargin]="true"><sky-row></sky-row></sky-fluid-grid>\`,
})
export class TestComponent {}`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.ts'))
      .toBe(`import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: \`<sky-fluid-grid><sky-row></sky-row></sky-fluid-grid>\`,
})
export class TestComponent {}`);
  });

  it('should not change files without a sky-fluid-grid element', async () => {
    const templateWithoutFluidGrid = `<sky-row></sky-row>`;
    const tree = setupTree({
      '/src/app/test.component.html': templateWithoutFluidGrid,
      '/src/styles.css': 'body { color: red; }',
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html')).toBe(
      templateWithoutFluidGrid,
    );
  });

  it('should warn with an aggregate count of elements that do not set disableMargin', async () => {
    const warnSpy = jest.fn();
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid></sky-fluid-grid>
<sky-fluid-grid></sky-fluid-grid>`,
    });

    runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnSpy(entry.message);
      }
    });

    await runSchematic(tree);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Found 2'));
  });

  it('should not double-count a file visited through overlapping project roots', async () => {
    const warnSpy = jest.fn();
    const tree = setupTree({
      // This path falls under both the app project (root: '') and the lib
      // project (sourceRoot: 'projects/lib/src'), so it would be visited
      // twice without deduplication.
      '/projects/lib/src/test.component.html': `<sky-fluid-grid></sky-fluid-grid>`,
    });

    runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnSpy(entry.message);
      }
    });

    await runSchematic(tree);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Found 1'));
  });
});
