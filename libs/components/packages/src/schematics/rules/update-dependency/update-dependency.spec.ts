import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { resolve } from 'path';
import { firstValueFrom } from 'rxjs';

import { createTestLibrary } from '../../testing/scaffold';

describe('update-dependency rule', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    resolve(__dirname, '../../../../migrations.json'),
  );

  async function setupTest(options?: {
    packageJson?: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
  }) {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });

    tree.overwrite('/package.json', JSON.stringify(options?.packageJson ?? {}));

    const updateDependency = await import('./update-dependency').then(
      (m) => m.default,
    );

    return {
      runRule: (options: any): Promise<Tree> =>
        firstValueFrom(runner.callRule(updateDependency(options), tree)),
      tree,
    };
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should update axe-core version if @skyux-sdk/testing installed', async () => {
    const { runRule, tree } = await setupTest({
      packageJson: {
        dependencies: {
          'axe-core': '*',
        },
        devDependencies: {
          '@skyux-sdk/testing': '*',
        },
      },
    });

    await runRule({
      ifThisPackageIsInstalled: '@skyux-sdk/testing',
      installThese: {
        'axe-core': '~4.11.1',
      },
      type: NodeDependencyType.Dev,
    });

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {},
      devDependencies: {
        '@skyux-sdk/testing': '*',
        'axe-core': '~4.11.1',
      },
    });
  });

  it('should abort if @skyux-sdk/testing not installed', async () => {
    const { runRule, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          'axe-core': '*',
        },
      },
    });

    await runRule({
      ifThisPackageIsInstalled: '@skyux-sdk/testing',
      installThese: {
        'axe-core': '~4.11.1',
      },
    });

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      devDependencies: { 'axe-core': '*' },
    });
  });

  it('should install axe-core if @skyux-sdk/testing installed without', async () => {
    const { runRule, tree } = await setupTest({
      packageJson: {
        devDependencies: {
          '@skyux-sdk/testing': '*',
        },
      },
    });

    await runRule({
      ifThisPackageIsInstalled: '@skyux-sdk/testing',
      installThese: {
        'axe-core': '~4.11.1',
      },
    });

    expect(JSON.parse(tree.readText('package.json'))).toEqual({
      dependencies: {
        'axe-core': '~4.11.1',
      },
      devDependencies: {
        '@skyux-sdk/testing': '*',
      },
    });
  });
});
