import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

describe('Migrations > Replace light blue custom property', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
  );

  async function setup(): Promise<{
    runSchematic: () => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });

    return {
      runSchematic: (): Promise<UnitTestTree> =>
        runner.runSchematic('replace-light-blue-custom-property', {}, tree),
      tree,
    };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should replace --sky-category-color-light-blue with --sky-category-color-green in TypeScript files', async () => {
    const { tree, runSchematic } = await setup();

    const tsContent = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  template: \`
    <div [style.color]="'var(--sky-category-color-light-blue)'">
      Test content
    </div>
  \`,
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  customProperty = '--sky-category-color-light-blue';
}
    `;

    tree.create('/src/app/test.component.ts', tsContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText('/src/app/test.component.ts');

    expect(updatedContent).toContain('--sky-category-color-green');
    expect(updatedContent).not.toContain('--sky-category-color-light-blue');
  });

  it('should replace --sky-category-color-light-blue with --sky-category-color-green in SCSS files', async () => {
    const { tree, runSchematic } = await setup();

    const scssContent = `
.test-class {
  color: var(--sky-category-color-light-blue);
  background-color: var(--sky-category-color-light-blue);
}

:host {
  --custom-prop: var(--sky-category-color-light-blue);
}
    `;

    tree.create('/src/app/test.component.scss', scssContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText('/src/app/test.component.scss');

    expect(updatedContent).toContain('--sky-category-color-green');
    expect(updatedContent).not.toContain('--sky-category-color-light-blue');
  });

  it('should not modify files that do not contain the old custom property', async () => {
    const { tree, runSchematic } = await setup();

    const originalContent = `
.test-class {
  color: var(--sky-category-color-red);
  background-color: var(--other-custom-property);
}
    `;

    tree.create('/src/app/clean.component.scss', originalContent);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText(
      '/src/app/clean.component.scss',
    );

    expect(updatedContent).toBe(originalContent);
  });

  it('should handle multiple occurrences in the same file', async () => {
    const { tree, runSchematic } = await setup();

    const content = `
.class1 { color: var(--sky-category-color-light-blue); }
.class2 { background: var(--sky-category-color-light-blue); }
.class3 { border-color: var(--sky-category-color-light-blue); }
    `;

    tree.create('/src/app/multiple.component.scss', content);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText(
      '/src/app/multiple.component.scss',
    );

    const matches = updatedContent.match(/--sky-category-color-green/g);
    expect(matches).toHaveLength(3);
    expect(updatedContent).not.toContain('--sky-category-color-light-blue');
  });

  it('should preserve var() function and fallback values around custom properties', async () => {
    const { tree, runSchematic } = await setup();

    const content = `
.test-class {
  color: var(--sky-category-color-light-blue);
  background: var(--sky-category-color-light-blue, blue);
  border: var(--sky-category-color-light-blue, var(--fallback-color));
}

@Component({
  template: \`
    <div [style.color]="'var(--sky-category-color-light-blue, red)'">
      Content
    </div>
  \`
})
export class TestComponent {
  styles = {
    backgroundColor: 'var(--sky-category-color-light-blue)',
    borderColor: 'var(--sky-category-color-light-blue, transparent)'
  };
}
    `;

    tree.create('/src/app/var-preservation.component.ts', content);

    const updatedTree = await runSchematic();

    const updatedContent = updatedTree.readText(
      '/src/app/var-preservation.component.ts',
    );

    // Verify var() function is preserved with new property
    expect(updatedContent).toContain('var(--sky-category-color-green)');
    expect(updatedContent).toContain('var(--sky-category-color-green, blue)');
    expect(updatedContent).toContain(
      'var(--sky-category-color-green, var(--fallback-color))',
    );
    expect(updatedContent).toContain("'var(--sky-category-color-green, red)'");
    expect(updatedContent).toContain("'var(--sky-category-color-green)'");
    expect(updatedContent).toContain(
      "'var(--sky-category-color-green, transparent)'",
    );

    // Verify old property is completely replaced
    expect(updatedContent).not.toContain('--sky-category-color-light-blue');
  });
});
