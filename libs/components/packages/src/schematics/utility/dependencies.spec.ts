import { Tree } from '@angular-devkit/schematics';

import {
  getProjectsUsingPackage,
  isPackageUsed,
  swapPackageDependency,
} from './dependencies';

describe('dependencies', () => {
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
            sourceRoot: 'src',
            architect: {},
          },
          'my-lib': {
            projectType: 'library',
            root: 'projects/my-lib',
            sourceRoot: 'projects/my-lib/src',
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

  describe('isPackageUsed', () => {
    it('should return false when no file references the package', async () => {
      const tree = setupTree({
        '/src/app/app.ts': `import { Component } from '@angular/core';\n`,
      });

      await expect(isPackageUsed(tree, '@skyux/foo')).resolves.toBe(false);
    });

    it('should find an import outside the source root', async () => {
      const tree = setupTree({
        '/projects/my-lib/testing/foo.ts': `import { Foo } from '@skyux/foo/testing';\n`,
      });

      await expect(isPackageUsed(tree, '@skyux/foo')).resolves.toBe(true);
    });

    it('should find a re-export', async () => {
      const tree = setupTree({
        '/src/index.ts': `export * from '@skyux/foo';\n`,
      });

      await expect(isPackageUsed(tree, '@skyux/foo')).resolves.toBe(true);
    });

    it('should ignore a local export', async () => {
      const tree = setupTree({
        '/src/index.ts': `const foo = 1;\nexport { foo };\n`,
      });

      await expect(isPackageUsed(tree, '@skyux/foo')).resolves.toBe(false);
    });
  });

  describe('getProjectsUsingPackage', () => {
    it('should return projects with a file outside the source root that references the package', async () => {
      const tree = setupTree({
        '/projects/my-lib/testing/foo.ts': `export { Foo } from '@skyux/foo';\n`,
      });

      const projects = await getProjectsUsingPackage(tree, '@skyux/foo');

      // The root app's root contains the library's root.
      expect(projects.map((project) => project.root)).toEqual([
        '',
        'projects/my-lib',
      ]);
    });

    it('should not return projects that do not reference the package', async () => {
      const tree = setupTree({
        '/src/app/foo.ts': `import { Foo } from '@skyux/foo';\n`,
      });

      const projects = await getProjectsUsingPackage(tree, '@skyux/foo');

      expect(projects.map((project) => project.root)).toEqual(['']);
    });
  });

  describe('swapPackageDependency', () => {
    const OLD_PACKAGE = '@blackbaud/old';
    const NEW_PACKAGE = '@skyux/new';
    const LIBRARY_PACKAGE_JSON = '/projects/my-lib/package.json';
    const oldPackageUsage = `import { OldModule } from '${OLD_PACKAGE}';\n`;

    function setupLibrary(
      sections: Record<string, Record<string, string>>,
      files: Record<string, string> = {},
    ): Tree {
      const tree = setupTree(files);
      tree.create(
        '/package.json',
        JSON.stringify({ dependencies: { [OLD_PACKAGE]: '1.0.0' } }),
      );
      tree.create(
        LIBRARY_PACKAGE_JSON,
        JSON.stringify({ name: 'my-lib', ...sections }, null, 2),
      );

      return tree;
    }

    /**
     * Swaps twice, so every spec also checks that a second run leaves the
     * library's `package.json` as the first run left it.
     */
    async function swapLibrary(tree: Tree): Promise<{
      dependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    }> {
      await swapPackageDependency(
        tree,
        'projects/my-lib',
        OLD_PACKAGE,
        NEW_PACKAGE,
      );
      const once = tree.readText(LIBRARY_PACKAGE_JSON);
      await swapPackageDependency(
        tree,
        'projects/my-lib',
        OLD_PACKAGE,
        NEW_PACKAGE,
      );

      expect(tree.readText(LIBRARY_PACKAGE_JSON)).toEqual(once);

      return JSON.parse(once);
    }

    it('should swap the old package for the new one in peerDependencies', async () => {
      const tree = setupLibrary({
        peerDependencies: {
          '@angular/core': '^21.0.0',
          [OLD_PACKAGE]: '^1.0.0',
        },
      });

      const { peerDependencies } = await swapLibrary(tree);

      expect(peerDependencies).toEqual({
        '@angular/core': '^21.0.0',
        [NEW_PACKAGE]: '0.0.0-PLACEHOLDER',
      });
    });

    it('should swap the old package for the new one in dependencies', async () => {
      const tree = setupLibrary({ dependencies: { [OLD_PACKAGE]: '1.0.0' } });

      const { dependencies, peerDependencies } = await swapLibrary(tree);

      expect(dependencies).toEqual({ [NEW_PACKAGE]: '0.0.0-PLACEHOLDER' });
      expect(peerDependencies).toBeUndefined();
    });

    it.each([
      ['a caret range', '^15.0.0'],
      ['an exact version', '15.12.0'],
    ])(
      'should mirror %s of @skyux/core from the same section',
      async (_description, coreVersion) => {
        const tree = setupLibrary({
          peerDependencies: {
            [OLD_PACKAGE]: '^1.0.0',
            '@skyux/core': coreVersion,
          },
        });

        const { peerDependencies } = await swapLibrary(tree);

        expect(peerDependencies?.[NEW_PACKAGE]).toEqual(coreVersion);
      },
    );

    it('should mirror @skyux/core from another section', async () => {
      const tree = setupLibrary({
        dependencies: { '@skyux/core': '^15.3.0' },
        peerDependencies: { [OLD_PACKAGE]: '^1.0.0' },
      });

      const { dependencies, peerDependencies } = await swapLibrary(tree);

      expect(peerDependencies?.[NEW_PACKAGE]).toEqual('^15.3.0');
      expect(dependencies?.[NEW_PACKAGE]).toBeUndefined();
    });

    it('should keep an existing entry for the new package', async () => {
      const tree = setupLibrary({
        peerDependencies: {
          [OLD_PACKAGE]: '^1.0.0',
          [NEW_PACKAGE]: '^15.10.0',
        },
      });

      const { peerDependencies } = await swapLibrary(tree);

      expect(peerDependencies?.[NEW_PACKAGE]).toEqual('^15.10.0');
    });

    it('should update every section that lists the old package', async () => {
      const tree = setupLibrary({
        dependencies: { [OLD_PACKAGE]: '1.0.0' },
        peerDependencies: { [OLD_PACKAGE]: '^1.0.0' },
      });

      const { dependencies, peerDependencies } = await swapLibrary(tree);

      expect(dependencies).toEqual({ [NEW_PACKAGE]: '0.0.0-PLACEHOLDER' });
      expect(peerDependencies).toEqual({ [NEW_PACKAGE]: '0.0.0-PLACEHOLDER' });
    });

    it('should keep the old package in every section when the library still uses it', async () => {
      const tree = setupLibrary(
        {
          dependencies: { [OLD_PACKAGE]: '1.0.0' },
          peerDependencies: { [OLD_PACKAGE]: '^1.0.0' },
        },
        { '/projects/my-lib/src/foo.ts': oldPackageUsage },
      );

      const { dependencies, peerDependencies } = await swapLibrary(tree);

      expect(dependencies).toEqual({
        [OLD_PACKAGE]: '1.0.0',
        [NEW_PACKAGE]: '0.0.0-PLACEHOLDER',
      });
      expect(peerDependencies).toEqual({
        [OLD_PACKAGE]: '^1.0.0',
        [NEW_PACKAGE]: '0.0.0-PLACEHOLDER',
      });
    });

    it('should not change a library package.json that does not list the old package', async () => {
      const tree = setupLibrary({
        peerDependencies: { '@skyux/core': '^15.0.0' },
      });
      const packageJson = tree.readText(LIBRARY_PACKAGE_JSON);

      await swapPackageDependency(
        tree,
        'projects/my-lib',
        OLD_PACKAGE,
        NEW_PACKAGE,
      );

      expect(tree.readText(LIBRARY_PACKAGE_JSON)).toEqual(packageJson);
    });
  });
});
