import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestLibrary } from '../../../testing/scaffold';

jest.mock('../../../../version', () => {
  return {
    VERSION: {
      major: 'CURRENT_VERSION',
    },
  };
});

describe('Migrations > Remove old compat stylesheets', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../migration-collection.json'),
  );

  async function setup(): Promise<{
    runSchematic: () => void;
    tree: UnitTestTree;
  }> {
    const tree = await createTestLibrary(runner, {
      projectName: 'foobar',
    });

    return {
      runSchematic: (): Promise<UnitTestTree> =>
        runner.runSchematic('remove-old-compat-stylesheets', {}, tree),
      tree,
    };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should remove older compat stylesheets', async () => {
    const { runSchematic, tree } = await setup();

    const stylesheets = [
      'projects/foobar-showcase/src/app/styles.css',
      'projects/foobar-showcase/src/app/skyux8-compat.css',
      'projects/foobar-showcase/src/app/skyux9-compat.css',
      'projects/foobar-showcase/src/app/skyuxCURRENT_VERSION-compat.css',
    ];

    tree.overwrite(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          foobar: {
            projectType: 'library',
            root: 'projects/foobar',
            architect: {
              build: {},
              test: {
                options: {
                  styles: ['@skyux/theme/css/sky.css'],
                },
              },
            },
          },
          'foobar-showcase': {
            projectType: 'application',
            root: 'projects/foobar-showcase',
            architect: {
              build: {
                options: {
                  styles: ['@skyux/theme/css/sky.css', ...stylesheets],
                },
              },
              test: {
                options: {
                  styles: ['@skyux/theme/css/sky.css', ...stylesheets],
                },
              },
            },
          },
        },
      }),
    );

    for (const stylesheet of stylesheets) {
      tree.create(stylesheet, 'CSS_CONTENT');
    }

    await runSchematic();

    expect(tree.readJson('/angular.json')).toEqual({
      version: 1,
      projects: {
        foobar: {
          projectType: 'library',
          root: 'projects/foobar',
          architect: {
            build: {},
            test: {
              options: {
                styles: ['@skyux/theme/css/sky.css'],
              },
            },
          },
        },
        'foobar-showcase': {
          projectType: 'application',
          root: 'projects/foobar-showcase',
          architect: {
            build: {
              options: {
                styles: [
                  '@skyux/theme/css/sky.css',
                  'projects/foobar-showcase/src/app/styles.css',
                  'projects/foobar-showcase/src/app/skyuxCURRENT_VERSION-compat.css',
                ],
              },
            },
            test: {
              options: {
                styles: [
                  '@skyux/theme/css/sky.css',
                  'projects/foobar-showcase/src/app/styles.css',
                  'projects/foobar-showcase/src/app/skyuxCURRENT_VERSION-compat.css',
                ],
              },
            },
          },
        },
      },
    });

    expect(tree.exists(stylesheets[0])).toEqual(true);
    expect(tree.exists(stylesheets[1])).toEqual(false);
    expect(tree.exists(stylesheets[2])).toEqual(false);
    expect(tree.exists(stylesheets[3])).toEqual(true);
  });

  it("should skip removing stylesheets that don't exist", async () => {
    const { runSchematic, tree } = await setup();

    // Add the stylesheet to the config, but do not create it.
    tree.overwrite(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          'foo-app': {
            projectType: 'application',
            root: 'src/app',
            architect: {
              build: {
                options: {
                  styles: ['src/app/skyux9-compat.css'],
                },
              },
            },
          },
        },
      }),
    );

    await runSchematic();

    expect(tree.readJson('/angular.json')).toEqual({
      version: 1,
      projects: {
        'foo-app': {
          projectType: 'application',
          root: 'src/app',
          architect: {
            build: {
              options: {
                styles: [],
              },
            },
          },
        },
      },
    });
  });
});
