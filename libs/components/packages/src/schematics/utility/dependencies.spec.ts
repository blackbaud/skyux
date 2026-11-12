import { Tree } from '@angular-devkit/schematics';

import { getProjectsUsingPackage, isPackageUsed } from './dependencies';

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
});
