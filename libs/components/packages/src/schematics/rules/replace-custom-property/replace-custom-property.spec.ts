import { SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

import { replaceCustomProperty } from './replace-custom-property';

const collectionPath = require.resolve('../../../../collection.json');

describe('replaceCustomProperty rule', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);

  async function setup(): Promise<{
    tree: UnitTestTree;
    context: SchematicContext;
  }> {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });

    const context = {
      logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
      },
    } as unknown as SchematicContext;

    return { tree, context };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should replace custom property in TypeScript files', async () => {
    const { tree, context } = await setup();

    const tsContent = `
export class TestComponent {
  color = 'var(--old-property)';
  property = '--old-property';
}
    `;

    tree.create('/src/app/test-file.ts', tsContent);

    const rule = replaceCustomProperty('--old-property', '--new-property');
    const result = await rule(tree, context);

    const updatedContent = (result as Tree).readText('/src/app/test-file.ts');
    expect(updatedContent).toContain('--new-property');
    expect(updatedContent).not.toContain('--old-property');
  });

  it('should replace custom property in SCSS files', async () => {
    const { tree, context } = await setup();

    const scssContent = `
.test-class {
  color: var(--old-property);
  --custom-var: var(--old-property);
}
    `;

    tree.create('/src/app/test-file.scss', scssContent);

    const rule = replaceCustomProperty('--old-property', '--new-property');
    const result = await rule(tree, context);

    const updatedContent = (result as Tree).readText('/src/app/test-file.scss');
    expect(updatedContent).toContain('--new-property');
    expect(updatedContent).not.toContain('--old-property');
  });

  it('should not modify files without the old custom property', async () => {
    const { tree, context } = await setup();

    const originalContent = `
.test-class {
  color: var(--different-property);
}
    `;

    tree.create('/src/app/clean-file.scss', originalContent);

    const rule = replaceCustomProperty('--old-property', '--new-property');
    const result = await rule(tree, context);

    const updatedContent = (result as Tree).readText(
      '/src/app/clean-file.scss',
    );
    expect(updatedContent).toBe(originalContent);
  });

  it('should handle multiple different custom properties', async () => {
    const { tree, context } = await setup();

    const tsContent = `
export class TestComponent {
  lightBlue = 'var(--sky-category-color-light-blue)';
  darkBlue = 'var(--sky-category-color-dark-blue)';
}
    `;

    tree.create('/src/app/test-multiple.ts', tsContent);

    const rule = replaceCustomProperty(
      '--sky-category-color-light-blue',
      '--sky-category-color-green',
    );
    const result = await rule(tree, context);

    const updatedContent = (result as Tree).readText(
      '/src/app/test-multiple.ts',
    );
    expect(updatedContent).toContain('--sky-category-color-green');
    expect(updatedContent).toContain('--sky-category-color-dark-blue'); // Should remain unchanged
    expect(updatedContent).not.toContain('--sky-category-color-light-blue');
  });
});
