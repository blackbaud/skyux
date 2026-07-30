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

describe('Migrations > Migrate Dragula polyfill', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
  );

  async function setup(config: {
    packageLock?: unknown;
    polyfills?: unknown;
    includeBuildOptions?: boolean;
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

  it('should warn and make no changes when package-lock.json is missing', async () => {
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

    expect(getBuildPolyfills(tree)).toEqual(['@skyux/packages/polyfills']);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('package-lock.json" file was not found'),
    );
  });

  it('should warn and make no changes for an unsupported lockfile version', async () => {
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

    expect(getBuildPolyfills(tree)).toEqual(['@skyux/packages/polyfills']);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('unsupported lockfile version'),
    );
  });
});
