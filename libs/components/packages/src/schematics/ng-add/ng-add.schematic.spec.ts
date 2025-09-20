import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp, createTestLibrary } from '../testing/scaffold';

const SCHEMATIC_NAME = 'ng-add';

const runner = new SchematicTestRunner(
  'migrations',
  path.join(__dirname, '../../../collection.json'),
);

async function setup(options: {
  projectType: 'application' | 'library';
}): Promise<{
  runSchematic: () => Promise<UnitTestTree>;
  tree: UnitTestTree;
}> {
  const tree =
    options.projectType === 'application'
      ? await createTestApp(runner, {
          projectName: 'my-project',
        })
      : await createTestLibrary(runner, { projectName: 'my-project' });

  return {
    runSchematic: (): Promise<UnitTestTree> =>
      runner.runSchematic(SCHEMATIC_NAME, {}, tree),
    tree,
  };
}

describe('ng-add.schematic', () => {
  it('should install dependencies', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    tree.overwrite('/package.json', '{}');

    const updatedTree = await runSchematic();

    expect(updatedTree.readText('/package.json')).toMatchSnapshot();
  });

  it('should update workspace config if a workspace only has one project', async () => {
    const { runSchematic } = await setup({ projectType: 'application' });

    const updatedTree = await runSchematic();

    expect(updatedTree.readText('/angular.json')).toMatchSnapshot();
  });

  it('should not update workspace config if a workspace has multiple projects', async () => {
    const { runSchematic } = await setup({ projectType: 'library' });

    const updatedTree = await runSchematic();

    expect(updatedTree.readText('/angular.json')).toMatchSnapshot();
  });
});
