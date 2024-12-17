import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { resolve } from 'path';

import { createTestLibrary } from '../../../testing/scaffold';

describe('update-eslint-9', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    resolve(__dirname, '../../migration-collection.json'),
  );

  async function setupTest(options?: {
    packageJson?: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
  }): Promise<{ tree: Tree; runSchematic: () => Promise<UnitTestTree> }> {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });

    tree.overwrite('/package.json', JSON.stringify(options?.packageJson ?? {}));

    return {
      runSchematic: () => runner.runSchematic('update-eslint-9', {}, tree),
      tree,
    };
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should update package version in dependencies if ESLint 9 is installed', async () => {
    const { tree, runSchematic } = await setupTest({
      packageJson: {
        dependencies: {
          eslint: '9.0.1',
          'other-package': '1.0.0',
        },
        devDependencies: {
          'dev-package': '1.0.0',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        eslint: '9.17.0',
        'other-package': '1.0.0',
      },
      devDependencies: {
        'dev-package': '1.0.0',
      },
    });
  });

  it('should update package version in dev dependencies if ESLint 9 is installed', async () => {
    const { tree, runSchematic } = await setupTest({
      packageJson: {
        dependencies: {
          'other-package': '1.0.0',
        },
        devDependencies: {
          'dev-package': '1.0.0',
          eslint: '9.0.1',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'other-package': '1.0.0',
      },
      devDependencies: {
        'dev-package': '1.0.0',
        eslint: '9.17.0',
      },
    });
  });

  it('should not install anything if package is not installed', async () => {
    const { tree, runSchematic } = await setupTest({
      packageJson: {
        dependencies: {
          'other-package': '1.0.0',
        },
        devDependencies: {
          'dev-package': '1.0.0',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'other-package': '1.0.0',
      },
      devDependencies: {
        'dev-package': '1.0.0',
      },
    });
  });

  it('should not update package version in dependencies if ESLint other than 9 is installed', async () => {
    const { tree, runSchematic } = await setupTest({
      packageJson: {
        dependencies: {
          eslint: '8.0.1',
          'other-package': '1.0.0',
        },
        devDependencies: {
          'dev-package': '1.0.0',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        eslint: '8.0.1',
        'other-package': '1.0.0',
      },
      devDependencies: {
        'dev-package': '1.0.0',
      },
    });
  });

  it('should not update package version in dev dependencies if ESLint other than 9 is installed', async () => {
    const { tree, runSchematic } = await setupTest({
      packageJson: {
        dependencies: {
          'other-package': '1.0.0',
        },
        devDependencies: {
          'dev-package': '1.0.0',
          eslint: '8.0.1',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'other-package': '1.0.0',
      },
      devDependencies: {
        'dev-package': '1.0.0',
        eslint: '8.0.1',
      },
    });
  });

  it('should not update package version in dependencies if ESLint greater than 9.17.0 is installed', async () => {
    const { tree, runSchematic } = await setupTest({
      packageJson: {
        dependencies: {
          eslint: '9.17.1',
          'other-package': '1.0.0',
        },
        devDependencies: {
          'dev-package': '1.0.0',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        eslint: '9.17.1',
        'other-package': '1.0.0',
      },
      devDependencies: {
        'dev-package': '1.0.0',
      },
    });
  });

  it('should not update package version in dev dependencies if ESLint greater than 9.17.0 is installed', async () => {
    const { tree, runSchematic } = await setupTest({
      packageJson: {
        dependencies: {
          'other-package': '1.0.0',
        },
        devDependencies: {
          'dev-package': '1.0.0',
          eslint: '9.17.1',
        },
      },
    });

    await runSchematic();

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'other-package': '1.0.0',
      },
      devDependencies: {
        'dev-package': '1.0.0',
        eslint: '9.17.1',
      },
    });
  });
});
