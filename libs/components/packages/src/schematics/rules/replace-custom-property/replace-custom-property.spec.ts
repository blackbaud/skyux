import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { firstValueFrom } from 'rxjs';

import { createTestApp } from '../../testing/scaffold';

import { replaceCustomProperty } from './replace-custom-property';

const collectionPath = require.resolve('../../../../collection.json');

describe('replaceCustomProperty rule', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);

  async function setup(): Promise<UnitTestTree> {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });

    return tree;
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should replace custom property in TypeScript files', async () => {
    const tree = await setup();

    const tsContent = `
export class TestComponent {
  color = 'var(--old-property)';
  property = '--old-property';
}
    `;

    tree.create('/src/app/test-file.ts', tsContent);

    await firstValueFrom(
      runner.callRule(
        replaceCustomProperty('--old-property', '--new-property'),
        tree,
      ),
    );

    const updatedContent = tree.readText('/src/app/test-file.ts');
    expect(updatedContent).toContain('--new-property');
    expect(updatedContent).not.toContain('--old-property');
  });

  it('should replace custom property in SCSS files', async () => {
    const tree = await setup();

    const scssContent = `
.test-class {
  color: var(--old-property);
  --custom-var: var(--old-property);
}
    `;

    tree.create('/src/app/test-file.scss', scssContent);

    await firstValueFrom(
      runner.callRule(
        replaceCustomProperty('--old-property', '--new-property'),
        tree,
      ),
    );

    const updatedContent = tree.readText('/src/app/test-file.scss');
    expect(updatedContent).toContain('--new-property');
    expect(updatedContent).not.toContain('--old-property');
  });

  it('should not modify files without the old custom property', async () => {
    const tree = await setup();

    const originalContent = `
.test-class {
  color: var(--different-property);
}
    `;

    tree.create('/src/app/clean-file.scss', originalContent);

    await firstValueFrom(
      runner.callRule(
        replaceCustomProperty('--old-property', '--new-property'),
        tree,
      ),
    );

    const updatedContent = tree.readText('/src/app/clean-file.scss');
    expect(updatedContent).toBe(originalContent);
  });

  it('should handle multiple different custom properties', async () => {
    const tree = await setup();

    const tsContent = `
export class TestComponent {
  lightBlue = 'var(--sky-category-color-light-blue)';
  darkBlue = 'var(--sky-category-color-dark-blue)';
}
    `;

    tree.create('/src/app/test-multiple.ts', tsContent);

    await firstValueFrom(
      runner.callRule(
        replaceCustomProperty(
          '--sky-category-color-light-blue',
          '--sky-category-color-green',
        ),
        tree,
      ),
    );

    const updatedContent = tree.readText('/src/app/test-multiple.ts');
    expect(updatedContent).toContain('--sky-category-color-green');
    expect(updatedContent).toContain('--sky-category-color-dark-blue'); // Should remain unchanged
    expect(updatedContent).not.toContain('--sky-category-color-light-blue');
  });

  it('should preserve var() function around custom properties', async () => {
    const tree = await setup();

    const content = `
.test-class {
  color: var(--old-property);
  background: var(--old-property, blue);
  border-color: var(--old-property, var(--fallback));
}

export class TestComponent {
  styles = {
    color: 'var(--old-property)',
    background: 'var(--old-property, red)'
  };
}
    `;

    tree.create('/src/app/var-test.scss', content);

    await firstValueFrom(
      runner.callRule(
        replaceCustomProperty('--old-property', '--new-property'),
        tree,
      ),
    );

    const updatedContent = tree.readText('/src/app/var-test.scss');

    // Verify var() function is preserved with new property
    expect(updatedContent).toContain('var(--new-property)');
    expect(updatedContent).toContain('var(--new-property, blue)');
    expect(updatedContent).toContain('var(--new-property, var(--fallback))');
    expect(updatedContent).toContain("'var(--new-property)'");
    expect(updatedContent).toContain("'var(--new-property, red)'");

    // Verify old property is completely replaced
    expect(updatedContent).not.toContain('--old-property');
  });

  it('should not process files with unsupported extensions', async () => {
    const tree = await setup();

    const htmlContent = `
<div style="color: var(--old-property);">Content</div>
    `;

    tree.create('/src/app/test.component.html', htmlContent);

    await firstValueFrom(
      runner.callRule(
        replaceCustomProperty('--old-property', '--new-property'),
        tree,
      ),
    );

    const updatedContent = tree.readText('/src/app/test.component.html');
    // HTML files should not be processed, so content should remain unchanged
    expect(updatedContent).toBe(htmlContent);
    expect(updatedContent).toContain('--old-property');
  });

  it('should handle regex special characters in custom property names', async () => {
    const tree = await setup();

    const content = `
.test-class {
  color: var(--my-prop.with[special](chars));
  background: var(--my-prop.with[special](chars), blue);
}
    `;

    tree.create('/src/app/special-chars.scss', content);

    await firstValueFrom(
      runner.callRule(
        replaceCustomProperty(
          '--my-prop.with[special](chars)',
          '--escaped-prop',
        ),
        tree,
      ),
    );

    const updatedContent = tree.readText('/src/app/special-chars.scss');
    expect(updatedContent).toContain('--escaped-prop');
    expect(updatedContent).toContain('var(--escaped-prop)');
    expect(updatedContent).toContain('var(--escaped-prop, blue)');
    expect(updatedContent).not.toContain('--my-prop.with[special](chars)');
  });

  it('should handle case where regex replace does not change content', async () => {
    const tree = await setup();

    const content = `
.test-class {
  /* This comment mentions --different-property that won't be replaced in comments by our simple replace */
}
    `;

    tree.create('/src/app/edge-case.scss', content);

    await firstValueFrom(
      runner.callRule(
        replaceCustomProperty('--non-existent-property', '--new-property'),
        tree,
      ),
    );

    const updatedContent = tree.readText('/src/app/edge-case.scss');
    expect(updatedContent).toBe(content); // Content should be unchanged
  });

  it('should process files in project root when no sourceRoot is defined', async () => {
    const tree = await setup();

    // Modify angular.json to remove sourceRoot
    const angularJson = tree.readJson('angular.json') as {
      projects: Record<string, { sourceRoot?: string }>;
    };
    delete angularJson.projects['test-app'].sourceRoot;
    tree.overwrite('angular.json', JSON.stringify(angularJson, null, 2));

    const content = `
export class TestComponent {
  color = 'var(--old-property)';
}
    `;

    // Place file in project root since no sourceRoot is defined
    tree.create('/test-root.ts', content);

    await firstValueFrom(
      runner.callRule(
        replaceCustomProperty('--old-property', '--new-property'),
        tree,
      ),
    );

    const updatedContent = tree.readText('/test-root.ts');
    expect(updatedContent).toContain('--new-property');
    expect(updatedContent).not.toContain('--old-property');
  });
});
