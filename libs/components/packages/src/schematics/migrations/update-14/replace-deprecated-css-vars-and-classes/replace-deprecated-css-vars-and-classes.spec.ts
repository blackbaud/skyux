import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';
import { firstValueFrom } from 'rxjs';

import { createTestApp, createTestLibrary } from '../../../testing/scaffold';

import {
  buildReplaceRule,
  traverseClasses,
  traverseTokens,
} from './replace-deprecated-css-vars-and-classes';

const COLLECTION_PATH = path.join(__dirname, '../../../../../migrations.json');
const SCHEMATIC_NAME = 'replace-deprecated-css-vars-and-classes';

async function setup(): Promise<{
  runner: SchematicTestRunner;
  runSchematic: () => Promise<UnitTestTree>;
  tree: UnitTestTree;
}> {
  const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);
  const tree = await createTestApp(runner, { projectName: 'my-app' });

  return {
    runner,
    runSchematic: () => runner.runSchematic(SCHEMATIC_NAME, {}, tree),
    tree,
  };
}

describe('replace-css-vars-and-classes', () => {
  it('should run successfully using the real design token JSON files', async () => {
    const { runSchematic } = await setup();

    await expect(runSchematic()).resolves.toBeInstanceOf(UnitTestTree);
  });

  it('should process files across all projects in a multi-project workspace', async () => {
    const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);
    const tree = await createTestLibrary(runner, { projectName: 'my-lib' });

    // Add a deprecated class to the library source and the showcase app source.
    tree.create(
      '/projects/my-lib/src/lib/test.component.html',
      `<div class="sky-old-class">Library content</div>`,
    );
    tree.create(
      '/projects/my-lib-showcase/src/app/test.component.html',
      `<div class="sky-old-class">Showcase content</div>`,
    );

    await firstValueFrom(
      runner.callRule(
        buildReplaceRule({ 'sky-old-class': 'sky-new-class' }, {}),
        tree,
      ),
    );

    expect(
      tree.readText('/projects/my-lib/src/lib/test.component.html'),
    ).toContain('sky-new-class');
    expect(
      tree.readText('/projects/my-lib-showcase/src/app/test.component.html'),
    ).toContain('sky-new-class');
  });

  describe('CSS class replacements', () => {
    it('should replace a CSS class in an HTML file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.component.html',
        `<div class="sky-old-class another-class">Content</div>`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({ 'sky-old-class': 'sky-new-class' }, {}),
          tree,
        ),
      );

      expect(tree.readText('/src/app/test.component.html')).toContain(
        'sky-new-class',
      );
      expect(tree.readText('/src/app/test.component.html')).not.toContain(
        'sky-old-class',
      );
    });

    it('should replace a CSS class in a TypeScript file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.component.ts',
        `
export class TestComponent {
  cssClass = 'sky-old-class';
  hostClass = 'sky-old-class active';
}
        `,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({ 'sky-old-class': 'sky-new-class' }, {}),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.component.ts');
      expect(updated).toContain('sky-new-class');
      expect(updated).not.toContain('sky-old-class');
    });

    it('should replace a CSS class in a JavaScript file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.js',
        `element.classList.add('sky-old-class');`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({ 'sky-old-class': 'sky-new-class' }, {}),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.js');
      expect(updated).toContain('sky-new-class');
      expect(updated).not.toContain('sky-old-class');
    });

    it('should replace a CSS class selector in a CSS file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.css',
        `.sky-old-class { color: red; }\n.sky-old-class:hover { color: blue; }`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({ 'sky-old-class': 'sky-new-class' }, {}),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.css');
      expect(updated).toContain('.sky-new-class');
      expect(updated).not.toContain('.sky-old-class');
    });

    it('should replace a CSS class selector in an SCSS file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.scss',
        `.sky-old-class {\n  color: red;\n  &:hover { color: blue; }\n}`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({ 'sky-old-class': 'sky-new-class' }, {}),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.scss');
      expect(updated).toContain('.sky-new-class');
      expect(updated).not.toContain('.sky-old-class');
    });

    it('should not replace a partial match in a longer class name', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.component.html',
        `<div class="sky-old-class-extended">Content</div>`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({ 'sky-old-class': 'sky-new-class' }, {}),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.component.html');
      expect(updated).toContain('sky-old-class-extended');
      expect(updated).not.toContain('sky-new-class-extended');
    });

    it('should not replace a class name that is prefixed by another class', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.component.html',
        `<div class="not-sky-old-class">Content</div>`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({ 'sky-old-class': 'sky-new-class' }, {}),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.component.html');
      expect(updated).toContain('not-sky-old-class');
      expect(updated).not.toContain('not-sky-new-class');
    });

    it('should replace multiple class names in a single file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.component.html',
        `<div class="sky-old-class sky-another-old-class">Content</div>`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule(
            {
              'sky-old-class': 'sky-new-class',
              'sky-another-old-class': 'sky-another-new-class',
            },
            {},
          ),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.component.html');
      expect(updated).toContain('sky-new-class');
      expect(updated).toContain('sky-another-new-class');
      expect(updated).not.toContain('sky-old-class');
      expect(updated).not.toContain('sky-another-old-class');
    });
  });

  describe('CSS custom property replacements', () => {
    it('should replace a custom property in an HTML file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.component.html',
        `<div style="color: var(--sky-old-var);">Content</div>`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({}, { '--sky-old-var': '--sky-new-var' }),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.component.html');
      expect(updated).toContain('--sky-new-var');
      expect(updated).not.toContain('--sky-old-var');
    });

    it('should replace a custom property in a TypeScript file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.component.ts',
        `
export class TestComponent {
  color = 'var(--sky-old-var)';
  property = '--sky-old-var';
}
        `,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({}, { '--sky-old-var': '--sky-new-var' }),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.component.ts');
      expect(updated).toContain('--sky-new-var');
      expect(updated).not.toContain('--sky-old-var');
    });

    it('should replace a custom property declaration and usage in a CSS file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.css',
        `:root { --sky-old-var: blue; }\n.foo { color: var(--sky-old-var); }`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({}, { '--sky-old-var': '--sky-new-var' }),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.css');
      expect(updated).toContain('--sky-new-var: blue');
      expect(updated).toContain('var(--sky-new-var)');
      expect(updated).not.toContain('--sky-old-var');
    });

    it('should replace a custom property in an SCSS file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.scss',
        `.foo {\n  color: var(--sky-old-var);\n  --sky-old-var: blue;\n}`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({}, { '--sky-old-var': '--sky-new-var' }),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.scss');
      expect(updated).toContain('--sky-new-var');
      expect(updated).not.toContain('--sky-old-var');
    });

    it('should not replace a custom property that is a prefix of a longer property name', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.css',
        `:root { --sky-old-var-extended: red; }\n.foo { color: var(--sky-old-var-extended); }`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({}, { '--sky-old-var': '--sky-new-var' }),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.css');
      expect(updated).toContain('--sky-old-var-extended');
      expect(updated).not.toContain('--sky-new-var-extended');
    });
  });

  describe('mixed replacements', () => {
    it('should apply both class and custom property replacements in the same file', async () => {
      const { runner, tree } = await setup();

      tree.create(
        '/src/app/test.scss',
        `.sky-old-class { color: var(--sky-old-var); }`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule(
            { 'sky-old-class': 'sky-new-class' },
            { '--sky-old-var': '--sky-new-var' },
          ),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.scss');
      expect(updated).toContain('.sky-new-class');
      expect(updated).toContain('var(--sky-new-var)');
      expect(updated).not.toContain('.sky-old-class');
      expect(updated).not.toContain('--sky-old-var');
    });

    it('should not let class and custom property replacements interfere when they share a substring', async () => {
      const { runner, tree } = await setup();

      // Both a class name and a CSS variable contain the substring "sky-color".
      // The class pass must not corrupt "--sky-color" and the property pass must
      // not corrupt ".sky-color".
      tree.create(
        '/src/app/test.scss',
        `.sky-color { color: var(--sky-color); }`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule(
            { 'sky-color': 'sky-new-color' },
            { '--sky-color': '--sky-new-color' },
          ),
          tree,
        ),
      );

      const updated = tree.readText('/src/app/test.scss');
      expect(updated).toContain('.sky-new-color');
      expect(updated).toContain('var(--sky-new-color)');
      expect(updated).not.toContain('.sky-old-color');
      expect(updated).not.toContain('--sky-old-color');
      // The class pass must not have rewritten "--sky-color" -> "--sky-new-color"
      // prematurely (or corrupted it), so the final string should have exactly
      // the right replacements and no doubled prefix like "--sky-new-new-color".
      expect(updated).not.toContain('--sky-new-new-color');
    });
  });

  describe('non-matching content', () => {
    it('should not modify files that do not contain matching patterns', async () => {
      const { runner, tree } = await setup();

      const originalContent = `.unrelated-class { color: var(--unrelated-var); }`;
      tree.create('/src/app/unchanged.scss', originalContent);

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule(
            { 'sky-old-class': 'sky-new-class' },
            { '--sky-old-var': '--sky-new-var' },
          ),
          tree,
        ),
      );

      expect(tree.readText('/src/app/unchanged.scss')).toBe(originalContent);
    });

    it('should not process files with unsupported extensions', async () => {
      const { runner, tree } = await setup();

      const originalContent = `sky-old-class --sky-old-var`;
      tree.create('/src/app/readme.md', originalContent);

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule(
            { 'sky-old-class': 'sky-new-class' },
            { '--sky-old-var': '--sky-new-var' },
          ),
          tree,
        ),
      );

      expect(tree.readText('/src/app/readme.md')).toBe(originalContent);
    });

    it('should fall back to project root when sourceRoot is not defined', async () => {
      const { runner, tree } = await setup();

      const angularJson = tree.readJson('angular.json') as {
        projects: Record<string, { sourceRoot?: string }>;
      };
      delete angularJson.projects['my-app'].sourceRoot;
      tree.overwrite('angular.json', JSON.stringify(angularJson, null, 2));

      tree.create(
        '/src/app/root-fallback.scss',
        `.sky-old-class { color: red; }`,
      );

      await firstValueFrom(
        runner.callRule(
          buildReplaceRule({ 'sky-old-class': 'sky-new-class' }, {}),
          tree,
        ),
      );

      expect(tree.readText('/src/app/root-fallback.scss')).toContain(
        'sky-new-class',
      );
    });
  });

  describe('traverseClasses', () => {
    it('should map each deprecatedClassNames entry to className', () => {
      const result: Record<string, string> = {};
      traverseClasses(
        {
          styles: [
            {
              name: 'Test',
              className: 'sky-new-class',
              deprecatedClassNames: ['sky-old-class', 'sky-also-old-class'],
            },
          ],
        },
        result,
      );
      expect(result).toEqual({
        'sky-old-class': 'sky-new-class',
        'sky-also-old-class': 'sky-new-class',
      });
    });

    it('should map each obsoleteClassNames entry to className', () => {
      const result: Record<string, string> = {};
      traverseClasses(
        {
          styles: [
            {
              name: 'Test',
              className: 'sky-new-class',
              obsoleteClassNames: ['sky-obsolete-class'],
            },
          ],
        },
        result,
      );
      expect(result).toEqual({ 'sky-obsolete-class': 'sky-new-class' });
    });

    it('should map both deprecatedClassNames and obsoleteClassNames', () => {
      const result: Record<string, string> = {};
      traverseClasses(
        {
          styles: [
            {
              name: 'Test',
              className: 'sky-new-class',
              deprecatedClassNames: ['sky-old-class'],
              obsoleteClassNames: ['sky-obsolete-class'],
            },
          ],
        },
        result,
      );
      expect(result).toEqual({
        'sky-old-class': 'sky-new-class',
        'sky-obsolete-class': 'sky-new-class',
      });
    });

    it('should ignore styles without deprecatedClassNames or obsoleteClassNames', () => {
      const result: Record<string, string> = {};
      traverseClasses(
        { styles: [{ name: 'Test', className: 'sky-class' }] },
        result,
      );
      expect(result).toEqual({});
    });

    it('should recurse into nested groups', () => {
      const result: Record<string, string> = {};
      traverseClasses(
        {
          groups: [
            {
              name: 'Group',
              styles: [
                {
                  name: 'Nested',
                  className: 'sky-new-nested',
                  deprecatedClassNames: ['sky-old-nested'],
                },
              ],
            },
          ],
        },
        result,
      );
      expect(result).toEqual({ 'sky-old-nested': 'sky-new-nested' });
    });
  });

  describe('traverseTokens', () => {
    it('should map each deprecatedCustomProperties entry to customProperty', () => {
      const result: Record<string, string> = {};
      traverseTokens(
        {
          tokens: [
            {
              name: 'Test',
              customProperty: '--sky-new-var',
              deprecatedCustomProperties: [
                '--sky-old-var',
                '--sky-also-old-var',
              ],
            },
          ],
        },
        result,
      );
      expect(result).toEqual({
        '--sky-old-var': '--sky-new-var',
        '--sky-also-old-var': '--sky-new-var',
      });
    });

    it('should map each obsoleteCustomProperties entry to customProperty', () => {
      const result: Record<string, string> = {};
      traverseTokens(
        {
          tokens: [
            {
              name: 'Test',
              customProperty: '--sky-new-var',
              obsoleteCustomProperties: ['--sky-obsolete-var'],
            },
          ],
        },
        result,
      );
      expect(result).toEqual({ '--sky-obsolete-var': '--sky-new-var' });
    });

    it('should map both deprecatedCustomProperties and obsoleteCustomProperties', () => {
      const result: Record<string, string> = {};
      traverseTokens(
        {
          tokens: [
            {
              name: 'Test',
              customProperty: '--sky-new-var',
              deprecatedCustomProperties: ['--sky-old-var'],
              obsoleteCustomProperties: ['--sky-obsolete-var'],
            },
          ],
        },
        result,
      );
      expect(result).toEqual({
        '--sky-old-var': '--sky-new-var',
        '--sky-obsolete-var': '--sky-new-var',
      });
    });

    it('should ignore tokens without deprecatedCustomProperties or obsoleteCustomProperties', () => {
      const result: Record<string, string> = {};
      traverseTokens(
        { tokens: [{ name: 'Test', customProperty: '--sky-var' }] },
        result,
      );
      expect(result).toEqual({});
    });

    it('should recurse into nested groups', () => {
      const result: Record<string, string> = {};
      traverseTokens(
        {
          groups: [
            {
              groupName: 'Group',
              tokens: [
                {
                  name: 'Nested',
                  customProperty: '--sky-new-nested',
                  deprecatedCustomProperties: ['--sky-old-nested'],
                },
              ],
            },
          ],
        },
        result,
      );
      expect(result).toEqual({ '--sky-old-nested': '--sky-new-nested' });
    });
  });
});
