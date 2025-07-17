import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestLibrary } from '../../../testing/scaffold';

jest.mock('../../../../version', () => ({
  VERSION: {
    major: '10',
  },
}));

describe('Migrations > Remove old compat stylesheets', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../../migrations.json'),
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

  it('should run', async () => {
    const { runSchematic } = await setup();
    expect(() => runSchematic()).not.toThrow();
  });
});
