import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestLibrary } from '../../../testing/scaffold';

const LOCAL_POLYFILL_PATH = 'projects/app/src/dragula-polyfill.js';

function getBuildPolyfills(tree: UnitTestTree): unknown {
  const angularJson = tree.readJson('/angular.json') as {
    projects: {
      app: { architect: { build: { options?: { polyfills?: unknown } } } };
    };
  };

  return angularJson.projects.app.architect.build.options?.polyfills;
}

function getTestPolyfills(tree: UnitTestTree): unknown {
  const angularJson = tree.readJson('/angular.json') as {
    projects: {
      app: { architect: { test?: { options?: { polyfills?: unknown } } } };
    };
  };

  return angularJson.projects.app.architect.test?.options?.polyfills;
}

describe('Migrations > Migrate Dragula polyfill', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
  );

  async function setup(config: {
    packageLock?: unknown;
    polyfills?: unknown;
    includeBuildOptions?: boolean;
    testPolyfills?: unknown;
  }): Promise<{
    runSchematic: () => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree = await createTestLibrary(runner, {
      projectName: 'foobar',
    });

    const build = config.includeBuildOptions
      ? { options: { polyfills: config.polyfills } }
      : {};

    const test =
      config.testPolyfills === undefined
        ? undefined
        : { options: { polyfills: config.testPolyfills } };

    tree.overwrite(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          app: {
            projectType: 'application',
            root: 'projects/app',
            sourceRoot: 'projects/app/src',
            architect: {
              build,
              ...(test ? { test } : {}),
            },
          },
        },
      }),
    );

    if (config.packageLock !== undefined) {
      tree.create('/package-lock.json', JSON.stringify(config.packageLock));
    }

    return {
      runSchematic: (): Promise<UnitTestTree> =>
        runner.runSchematic('migrate-dragula-polyfill', {}, tree),
      tree,
    };
  }

  it('should remove the polyfill when Dragula is not installed', async () => {
    const { runSchematic, tree } = await setup({
      packageLock: { packages: { 'node_modules/zone.js': {} } },
      includeBuildOptions: true,
      polyfills: ['zone.js', '@skyux/packages/polyfills'],
    });

    await runSchematic();

    expect(getBuildPolyfills(tree)).toEqual(['zone.js']);
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(false);
  });

  it('should replace the polyfill with a local copy when Dragula is installed', async () => {
    const { runSchematic, tree } = await setup({
      packageLock: { packages: { 'node_modules/dragula': {} } },
      includeBuildOptions: true,
      polyfills: ['zone.js', '@skyux/packages/polyfills'],
    });

    await runSchematic();

    expect(getBuildPolyfills(tree)).toEqual(['zone.js', LOCAL_POLYFILL_PATH]);
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(true);
    expect(tree.readText(LOCAL_POLYFILL_PATH)).toContain(
      'window.global = window;',
    );
  });

  it('should detect Dragula when installed transitively', async () => {
    const { runSchematic, tree } = await setup({
      packageLock: {
        packages: { 'node_modules/some-lib/node_modules/dragula': {} },
      },
      includeBuildOptions: true,
      polyfills: ['@skyux/packages/polyfills'],
    });

    await runSchematic();

    expect(getBuildPolyfills(tree)).toEqual([LOCAL_POLYFILL_PATH]);
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(true);
  });

  it('should leave projects without the polyfill entry untouched', async () => {
    const { runSchematic, tree } = await setup({
      packageLock: { packages: { 'node_modules/zone.js': {} } },
      includeBuildOptions: true,
      polyfills: ['zone.js'],
    });

    await runSchematic();

    expect(getBuildPolyfills(tree)).toEqual(['zone.js']);
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(false);
  });

  it('should ignore build targets without a polyfills array', async () => {
    const { runSchematic, tree } = await setup({
      packageLock: { packages: { 'node_modules/dragula': {} } },
      includeBuildOptions: true,
      polyfills: 'zone.js',
    });

    await runSchematic();

    expect(getBuildPolyfills(tree)).toEqual('zone.js');
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(false);
  });

  it('should migrate polyfills in the test target', async () => {
    const { runSchematic, tree } = await setup({
      packageLock: { packages: { 'node_modules/dragula': {} } },
      includeBuildOptions: true,
      polyfills: ['zone.js', '@skyux/packages/polyfills'],
      testPolyfills: [
        'zone.js',
        'zone.js/testing',
        '@skyux/packages/polyfills',
      ],
    });

    await runSchematic();

    expect(getBuildPolyfills(tree)).toEqual(['zone.js', LOCAL_POLYFILL_PATH]);
    expect(getTestPolyfills(tree)).toEqual([
      'zone.js',
      'zone.js/testing',
      LOCAL_POLYFILL_PATH,
    ]);
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(true);
  });

  it('should remove the test polyfill when Dragula is not installed', async () => {
    const { runSchematic, tree } = await setup({
      packageLock: { packages: { 'node_modules/zone.js': {} } },
      testPolyfills: ['zone.js', '@skyux/packages/polyfills'],
    });

    await runSchematic();

    expect(getTestPolyfills(tree)).toEqual(['zone.js']);
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(false);
  });

  it('should migrate polyfills in build configurations', async () => {
    const { runSchematic, tree } = await setup({
      packageLock: { packages: { 'node_modules/dragula': {} } },
    });

    tree.overwrite(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          app: {
            projectType: 'application',
            root: 'projects/app',
            sourceRoot: 'projects/app/src',
            architect: {
              build: {
                options: {
                  polyfills: ['zone.js', '@skyux/packages/polyfills'],
                },
                configurations: {
                  production: {
                    polyfills: ['@skyux/packages/polyfills'],
                  },
                },
              },
            },
          },
        },
      }),
    );

    await runSchematic();

    const build = (
      tree.readJson('/angular.json') as {
        projects: {
          app: {
            architect: {
              build: {
                options: { polyfills: unknown };
                configurations: { production: { polyfills: unknown } };
              };
            };
          };
        };
      }
    ).projects.app.architect.build;

    expect(build.options.polyfills).toEqual(['zone.js', LOCAL_POLYFILL_PATH]);
    expect(build.configurations.production.polyfills).toEqual([
      LOCAL_POLYFILL_PATH,
    ]);
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(true);
  });

  it('should retain a local shim when package-lock.json is missing', async () => {
    const warnSpy = jest.fn();
    const { tree } = await setup({
      includeBuildOptions: true,
      polyfills: ['@skyux/packages/polyfills'],
    });

    runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnSpy(entry.message);
      }
    });

    await runner.runSchematic('migrate-dragula-polyfill', {}, tree);

    expect(getBuildPolyfills(tree)).toEqual([LOCAL_POLYFILL_PATH]);
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('package-lock.json" file was not found'),
    );
  });

  it('should retain a local shim when package-lock.json is malformed', async () => {
    const warnSpy = jest.fn();
    const { tree } = await setup({
      includeBuildOptions: true,
      polyfills: ['@skyux/packages/polyfills'],
    });

    tree.create('/package-lock.json', '{ invalid json');

    runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnSpy(entry.message);
      }
    });

    await runner.runSchematic('migrate-dragula-polyfill', {}, tree);

    expect(getBuildPolyfills(tree)).toEqual([LOCAL_POLYFILL_PATH]);
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('could not be parsed'),
    );
  });

  it('should retain a local shim for an unsupported lockfile version', async () => {
    const warnSpy = jest.fn();
    const { tree } = await setup({
      packageLock: { dependencies: { dragula: {} } },
      includeBuildOptions: true,
      polyfills: ['@skyux/packages/polyfills'],
    });

    runner.logger.subscribe((entry) => {
      if (entry.level === 'warn') {
        warnSpy(entry.message);
      }
    });

    await runner.runSchematic('migrate-dragula-polyfill', {}, tree);

    expect(getBuildPolyfills(tree)).toEqual([LOCAL_POLYFILL_PATH]);
    expect(tree.exists(LOCAL_POLYFILL_PATH)).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('unsupported lockfile version'),
    );
  });
});
