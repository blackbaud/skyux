import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp, createTestLibrary } from '../../testing/scaffold';
import { JsonFile } from '../../utility/json-file';

import { Schema } from './schema';

const SCHEMATIC_NAME = 'add-skyux-to-project';

const runner = new SchematicTestRunner(
  'migrations',
  path.join(__dirname, '../../../../collection.json'),
);

async function setup(options: {
  projectType: 'application' | 'library';
}): Promise<{
  runSchematic: (options: Schema) => Promise<UnitTestTree>;
  tree: UnitTestTree;
}> {
  const tree =
    options.projectType === 'application'
      ? await createTestApp(runner, {
          projectName: 'my-project',
        })
      : await createTestLibrary(runner, { projectName: 'my-project' });

  return {
    runSchematic: (options: Schema): Promise<UnitTestTree> =>
      runner.runSchematic(SCHEMATIC_NAME, options, tree),
    tree,
  };
}

describe(SCHEMATIC_NAME, () => {
  it('should set allowedCommonJsDependencies in workspace config', async () => {
    const { runSchematic } = await setup({ projectType: 'application' });

    const updatedTree = await runSchematic({ project: 'my-project' });
    const angularJson = new JsonFile(updatedTree, '/angular.json');

    expect(
      angularJson.get([
        'projects',
        'my-project',
        'architect',
        'build',
        'options',
        'allowedCommonJsDependencies',
      ]),
    ).toEqual([
      '@skyux/icons',
      'autonumeric',
      'fontfaceobserver',
      'intl-tel-input',
      'moment',
    ]);
  });

  it('should set polyfills in workspace config', async () => {
    const { runSchematic } = await setup({ projectType: 'application' });

    const updatedTree = await runSchematic({ project: 'my-project' });
    const angularJson = new JsonFile(updatedTree, '/angular.json');

    expect(
      angularJson.get([
        'projects',
        'my-project',
        'architect',
        'build',
        'options',
        'polyfills',
      ]),
    ).toEqual(['zone.js', '@skyux/packages/polyfills']);

    expect(
      angularJson.get([
        'projects',
        'my-project',
        'architect',
        'test',
        'options',
        'polyfills',
      ]),
    ).toEqual(['zone.js', 'zone.js/testing', '@skyux/packages/polyfills']);
  });

  it('should handle existing polyfills set to a string', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    const angularJson = new JsonFile(tree, '/angular.json');
    angularJson.modify(
      ['projects', 'my-project', 'architect', 'build', 'options', 'polyfills'],
      'my-polyfills.js',
    );

    const updatedTree = await runSchematic({ project: 'my-project' });
    const updatedAngularJson = new JsonFile(updatedTree, '/angular.json');

    expect(
      updatedAngularJson.get([
        'projects',
        'my-project',
        'architect',
        'build',
        'options',
        'polyfills',
      ]),
    ).toEqual(['my-polyfills.js', '@skyux/packages/polyfills']);
  });

  it('should handle existing polyfills undefined', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    const angularJson = new JsonFile(tree, '/angular.json');
    angularJson.remove([
      'projects',
      'my-project',
      'architect',
      'build',
      'options',
      'polyfills',
    ]);

    const updatedTree = await runSchematic({ project: 'my-project' });
    const updatedAngularJson = new JsonFile(updatedTree, '/angular.json');

    expect(
      updatedAngularJson.get([
        'projects',
        'my-project',
        'architect',
        'build',
        'options',
        'polyfills',
      ]),
    ).toEqual(['@skyux/packages/polyfills']);
  });

  it('should set styles in workspace config', async () => {
    const { runSchematic } = await setup({ projectType: 'application' });

    const updatedTree = await runSchematic({ project: 'my-project' });
    const angularJson = new JsonFile(updatedTree, '/angular.json');

    expect(
      angularJson.get([
        'projects',
        'my-project',
        'architect',
        'build',
        'options',
        'styles',
      ]),
    ).toEqual([
      'src/styles.scss',
      '@skyux/theme/css/sky.css',
      '@skyux/theme/css/themes/modern/styles.css',
    ]);

    expect(
      angularJson.get([
        'projects',
        'my-project',
        'architect',
        'test',
        'options',
        'styles',
      ]),
    ).toEqual([
      'src/styles.scss',
      '@skyux/theme/css/sky.css',
      '@skyux/theme/css/themes/modern/styles.css',
    ]);
  });
});
