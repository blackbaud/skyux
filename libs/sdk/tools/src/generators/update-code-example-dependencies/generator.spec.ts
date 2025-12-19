import { version as ANGULAR_VERSION } from '@angular/core/package.json';
import { Tree, readJson, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

describe('update dependencies generator', () => {
  let appTree: Tree;
  const options = {
    skipFormat: true,
  };

  beforeEach(() => {
    jest.mock('@nx/devkit', () => ({
      ...jest.requireActual<object>('@nx/devkit'),
      readCachedProjectGraph: jest.fn().mockReturnValue({
        nodes: {
          'my-lib': {
            name: 'my-lib',
            type: 'lib',
            data: {
              root: 'libs/my-lib',
              sourceRoot: 'libs/my-lib/src',
              projectType: 'library',
              metadata: {
                js: {
                  packageName: '@skyux/my-lib',
                },
              },
            },
          },
        },
        dependencies: {},
      }),
    }));
    appTree = createTreeWithEmptyWorkspace();
    appTree.write('.gitignore', 'node_modules');
  });

  it('should run successfully', async () => {
    writeJson(appTree, 'package.json', {
      version: '13.4.5',
      dependencies: {
        '@angular/common': ANGULAR_VERSION,
        '@angular/core': ANGULAR_VERSION,
        'some-other-dep': '1.2.3',
      },
      devDependencies: {},
    });
    writeJson(
      appTree,
      'apps/code-examples/src/assets/stack-blitz/package.json',
      {
        dependencies: {
          '@angular/common': '^12.0.0',
          '@angular/core': '^12.0.0',
          '@skyux/my-lib': '0.0.1',
          'some-other-dep': '0.9.0',
        },
        devDependencies: {},
      },
    );

    const generator = jest.requireActual('./generator').default;

    await generator(appTree, options);

    const updatedPackageJson = readJson(
      appTree,
      'apps/code-examples/src/assets/stack-blitz/package.json',
    );

    expect(updatedPackageJson.dependencies['@angular/common']).toBe(
      `^${ANGULAR_VERSION}`,
    );
    expect(updatedPackageJson.dependencies['@angular/core']).toBe(
      `^${ANGULAR_VERSION}`,
    );
    expect(updatedPackageJson.dependencies['@skyux/my-lib']).toBe('^13.4.5');
    expect(updatedPackageJson.dependencies['some-other-dep']).toBe('1.2.3');
  });
});
