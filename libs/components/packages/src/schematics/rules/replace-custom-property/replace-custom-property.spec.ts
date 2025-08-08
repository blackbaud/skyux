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
});
