import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp, createTestLibrary } from '../../../testing/scaffold';

const COLLECTION_PATH = path.join(__dirname, '../../../../../migrations.json');
const SCHEMATIC_NAME = 'replace-obsolete-css-classes';

async function setup(options: {
  projectType: 'application' | 'library';
}): Promise<{
  runner: SchematicTestRunner;
  runSchematic: () => Promise<UnitTestTree>;
  tree: UnitTestTree;
}> {
  const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);

  const tree =
    options.projectType === 'application'
      ? await createTestApp(runner, { projectName: 'my-app' })
      : await createTestLibrary(runner, { projectName: 'my-lib' });

  return {
    runner,
    runSchematic: () => runner.runSchematic(SCHEMATIC_NAME, {}, tree),
    tree,
  };
}

describe(SCHEMATIC_NAME, () => {
  it('should replace a single obsolete class in an HTML file', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.html',
      '<div class="sky-margin-stacked-compact"></div>',
    );

    await runSchematic();

    expect(tree.readText('/src/app/test.component.html')).toBe(
      '<div class="sky-theme-margin-bottom-xs"></div>',
    );
  });

  it('should replace multiple obsolete classes while preserving non-obsolete classes', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.html',
      '<div class="sky-margin-stacked-compact my-custom-class sky-section-heading"></div>',
    );

    await runSchematic();

    const result = tree.readText('/src/app/test.component.html');
    expect(result).toContain('sky-theme-margin-bottom-xs');
    expect(result).toContain('my-custom-class');
    expect(result).toContain('sky-theme-font-heading-2');
    expect(result).not.toContain('sky-margin-stacked-compact');
    expect(result).not.toContain('sky-section-heading');
  });

  it('should replace obsolete classes in nested HTML elements', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.html',
      `<div class="sky-margin-stacked-compact">
  <span class="sky-section-heading">Title</span>
</div>`,
    );

    await runSchematic();

    const result = tree.readText('/src/app/test.component.html');
    expect(result).toContain('sky-theme-margin-bottom-xs');
    expect(result).toContain('sky-theme-font-heading-2');
  });

  it('should replace [class.sky-obsolete] bindings', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.html',
      '<div [class.sky-margin-stacked-compact]="condition"></div>',
    );

    await runSchematic();

    const result = tree.readText('/src/app/test.component.html');
    expect(result).toContain('[class.sky-theme-margin-bottom-xs]');
    expect(result).not.toContain('sky-margin-stacked-compact');
  });

  it('should replace obsolete class names in [ngClass] expressions', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.html',
      `<div [ngClass]="{'sky-margin-stacked-compact': isCompact, 'sky-section-heading': isHeading}"></div>`,
    );

    await runSchematic();

    const result = tree.readText('/src/app/test.component.html');
    expect(result).toContain('sky-theme-margin-bottom-xs');
    expect(result).toContain('sky-theme-font-heading-2');
    expect(result).not.toContain('sky-margin-stacked-compact');
    expect(result).not.toContain('sky-section-heading');
  });

  it('should replace obsolete class selectors in SCSS files', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.scss',
      `.sky-margin-stacked-compact {
  color: red;
}

.my-class .sky-section-heading {
  font-weight: bold;
}`,
    );

    await runSchematic();

    const result = tree.readText('/src/app/test.component.scss');
    expect(result).toContain('.sky-theme-margin-bottom-xs');
    expect(result).toContain('.sky-theme-font-heading-2');
    expect(result).not.toContain('.sky-margin-stacked-compact');
    expect(result).not.toContain('.sky-section-heading');
  });

  it('should replace obsolete class selectors in CSS files', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.css',
      `.sky-margin-stacked-compact { color: red; }`,
    );

    await runSchematic();

    const result = tree.readText('/src/app/test.component.css');
    expect(result).toContain('.sky-theme-margin-bottom-xs');
    expect(result).not.toContain('.sky-margin-stacked-compact');
  });

  it('should replace obsolete classes in inline templates', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.ts',
      `import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: \`<div class="sky-margin-stacked-compact">content</div>\`,
})
export class TestComponent {}`,
    );

    await runSchematic();

    const result = tree.readText('/src/app/test.component.ts');
    expect(result).toContain('sky-theme-margin-bottom-xs');
    expect(result).not.toContain('sky-margin-stacked-compact');
  });

  it('should not modify files without obsolete classes', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    const originalContent = '<div class="my-custom-class"></div>';
    tree.create('/src/app/test.component.html', originalContent);

    await runSchematic();

    expect(tree.readText('/src/app/test.component.html')).toBe(originalContent);
  });

  it('should not replace partial class name matches in HTML', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.html',
      '<div class="sky-margin-stacked-compact-extra"></div>',
    );

    await runSchematic();

    expect(tree.readText('/src/app/test.component.html')).toBe(
      '<div class="sky-margin-stacked-compact-extra"></div>',
    );
  });

  it('should not replace partial class name matches in SCSS selectors', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.scss',
      `.sky-margin-stacked-compact-extra { color: red; }`,
    );

    await runSchematic();

    expect(tree.readText('/src/app/test.component.scss')).toBe(
      `.sky-margin-stacked-compact-extra { color: red; }`,
    );
  });

  it('should handle class attribute with interpolation', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.create(
      '/src/app/test.component.html',
      '<div class="sky-margin-stacked-compact {{dynamicClass}}"></div>',
    );

    await runSchematic();

    const result = tree.readText('/src/app/test.component.html');
    expect(result).toContain('sky-theme-margin-bottom-xs');
    expect(result).toContain('{{dynamicClass}}');
    expect(result).not.toContain('sky-margin-stacked-compact');
  });

  it('should work with library projects', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'library' });

    tree.create(
      '/projects/my-lib/src/lib/test.component.html',
      '<div class="sky-margin-stacked-compact"></div>',
    );

    await runSchematic();

    expect(
      tree.readText('/projects/my-lib/src/lib/test.component.html'),
    ).toContain('sky-theme-margin-bottom-xs');
  });
});
