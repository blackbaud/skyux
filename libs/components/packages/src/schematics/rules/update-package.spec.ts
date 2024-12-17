import { SchematicContext, Tree } from '@angular-devkit/schematics';

import { updateInstalledPackage } from './update-package';

describe('update-package utility', () => {
  function setupTest(options?: {
    packageJson?: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
  }): { tree: Tree; context: SchematicContext } {
    const tree = Tree.empty();
    tree.create('package.json', JSON.stringify(options?.packageJson ?? {}));
    const context = { addTask: jest.fn() } as unknown as SchematicContext;

    return {
      tree,
      context,
    };
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should update package version in dependencies if package is installed', async () => {
    const { tree, context } = setupTest({
      packageJson: {
        dependencies: {
          'axe-core': '4.1.0',
          'other-package': '1.0.0',
        },
        devDependencies: {
          'dev-package': '1.0.0',
        },
      },
    });

    const rule = updateInstalledPackage('axe-core', '4.2.0');
    await rule(tree, context);

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'axe-core': '4.2.0',
        'other-package': '1.0.0',
      },
      devDependencies: {
        'dev-package': '1.0.0',
      },
    });
  });

  it('should update package version in dev dependencies if package is installed', async () => {
    const { tree, context } = setupTest({
      packageJson: {
        dependencies: {
          'other-package': '1.0.0',
        },
        devDependencies: {
          'axe-core': '4.1.0',
          'dev-package': '1.0.0',
        },
      },
    });

    const rule = updateInstalledPackage('axe-core', '4.2.0');
    await rule(tree, context);

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'other-package': '1.0.0',
      },
      devDependencies: {
        'axe-core': '4.2.0',
        'dev-package': '1.0.0',
      },
    });
  });

  it('should not install anything if package is not installed', async () => {
    const { tree, context } = setupTest({
      packageJson: {
        dependencies: {
          'other-package': '1.0.0',
        },
        devDependencies: {
          'dev-package': '1.0.0',
        },
      },
    });

    const rule = updateInstalledPackage('axe-core', '4.2.0');
    await rule(tree, context);

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'other-package': '1.0.0',
      },
      devDependencies: {
        'dev-package': '1.0.0',
      },
    });
  });

  it('should not update the package if the package is not currently in the checked version range (^)', async () => {
    const { tree, context } = setupTest({
      packageJson: {
        dependencies: {
          'other-package': '1.0.0',
          'axe-core': '3.0.1',
        },
        devDependencies: {
          'dev-package': '1.0.0',
        },
      },
    });

    const rule = updateInstalledPackage('axe-core', '4.2.0', '^4.0.0');
    await rule(tree, context);

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'other-package': '1.0.0',
        'axe-core': '3.0.1',
      },
      devDependencies: {
        'dev-package': '1.0.0',
      },
    });
  });

  it('should not update the package if the package is not currently in the checked version range (exact)', async () => {
    const { tree, context } = setupTest({
      packageJson: {
        dependencies: {
          'other-package': '1.0.0',
          'axe-core': '4.0.1',
        },
      },
    });

    const rule = updateInstalledPackage('axe-core', '4.2.0', '4.0.2');
    await rule(tree, context);

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'other-package': '1.0.0',
        'axe-core': '4.0.1',
      },
    });
  });

  it('should not update the package if the package is not currently in the checked version range (~)', async () => {
    const { tree, context } = setupTest({
      packageJson: {
        devDependencies: {
          'dev-package': '1.0.0',
          'axe-core': '4.1.0',
        },
      },
    });

    const rule = updateInstalledPackage('axe-core', '4.2.0', '~4.1.1');
    await rule(tree, context);

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: {
        'dev-package': '1.0.0',
        'axe-core': '4.1.0',
      },
    });
  });

  it('should update the package if the package is currently in the checked version range (^)', async () => {
    const { tree, context } = setupTest({
      packageJson: {
        dependencies: {
          'other-package': '1.0.0',
          'axe-core': '4.1.0',
        },
        devDependencies: {
          'dev-package': '1.0.0',
        },
      },
    });

    const rule = updateInstalledPackage('axe-core', '4.2.0', '^4.0.0');
    await rule(tree, context);

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'other-package': '1.0.0',
        'axe-core': '4.2.0',
      },
      devDependencies: {
        'dev-package': '1.0.0',
      },
    });
  });

  it('should update the package if the package is currently in the checked version range (exact)', async () => {
    const { tree, context } = setupTest({
      packageJson: {
        dependencies: {
          'other-package': '1.0.0',
          'axe-core': '4.0.2',
        },
      },
    });

    const rule = updateInstalledPackage('axe-core', '4.2.0', '4.0.2');
    await rule(tree, context);

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'other-package': '1.0.0',
        'axe-core': '4.2.0',
      },
    });
  });

  it('should update the package if the package is currently in the checked version range (~)', async () => {
    const { tree, context } = setupTest({
      packageJson: {
        devDependencies: {
          'dev-package': '1.0.0',
          'axe-core': '4.1.1',
        },
      },
    });

    const rule = updateInstalledPackage('axe-core', '4.2.0', '~4.1.0');
    await rule(tree, context);

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: {
        'dev-package': '1.0.0',
        'axe-core': '4.2.0',
      },
    });
  });
});
