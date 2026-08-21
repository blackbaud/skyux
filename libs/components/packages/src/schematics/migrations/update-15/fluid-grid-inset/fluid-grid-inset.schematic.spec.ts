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

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-fluid-grid>
  <sky-row></sky-row>
</sky-fluid-grid>`);
  });

  it('should remove a bare static attribute', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid disableMargin>
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-fluid-grid>
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

  it('should replace a static `false` value with `inset="true"`', async () => {
    const tree = setupTree({
      '/src/app/test.component.html': `<sky-fluid-grid disableMargin="false">
  <sky-row></sky-row>
</sky-fluid-grid>`,
    });

    await runSchematic(tree);

    expect(tree.readText('/src/app/test.component.html'))
      .toBe(`<sky-fluid-grid inset="true">
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
});
