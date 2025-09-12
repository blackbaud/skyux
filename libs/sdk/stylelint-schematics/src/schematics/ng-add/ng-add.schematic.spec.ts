import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp, createTestLibrary } from '../testing/scaffold.js';
import { JsonFile } from '../utility/json-file';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add', () => {
  async function setup(options?: {
    projectType?: 'library' | 'application';
  }): Promise<{
    runSchematic: () => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

    const tree =
      options?.projectType === 'library'
        ? await createTestLibrary(runner, {
            projectName: 'foo',
          })
        : await createTestApp(runner, {
            projectName: 'foo',
          });

    return {
      runSchematic: () => runner.runSchematic('ng-add', {}, tree),
      tree,
    };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should install dependencies', async () => {
    const { runSchematic } = await setup();

    const tree = await runSchematic();

    const packageJson = JSON.parse(tree.readText('/package.json'));

    expect(packageJson.devDependencies).toEqual(
      expect.objectContaining({
        'skyux-stylelint': '0.0.0-PLACEHOLDER',
        stylelint: '^16.24.0',
        'stylelint-config-recommended-scss': '^16.0.1',
        'stylelint-config-skyux': '0.0.0-PLACEHOLDER',
      }),
    );
  });

  it('should configure VSCode', async () => {
    const { runSchematic } = await setup();

    const updatedTree = await runSchematic();

    const extensions = new JsonFile(updatedTree, '/.vscode/extensions.json');
    const settings = new JsonFile(updatedTree, '/.vscode/settings.json');

    expect(extensions.get(['recommendations'])).toContain(
      'stylelint.vscode-stylelint',
    );

    expect(settings.get(['stylelint.validate'])).toEqual(['css', 'scss']);
  });

  it('should not configure VSCode if .vscode folder not found', async () => {
    const { runSchematic, tree } = await setup();

    // Empty the .vscode folder.
    tree.getDir('.vscode').visit((file) => tree.delete(file));

    const updatedTree = await runSchematic();

    expect(updatedTree.exists('.vscode/extensions.json')).toEqual(false);
  });

  it('should handle missing extensions file', async () => {
    const { runSchematic, tree } = await setup();

    tree.delete('.vscode/extensions.json');

    const updatedTree = await runSchematic();

    const extensions = new JsonFile(updatedTree, '/.vscode/extensions.json');
    const settings = new JsonFile(updatedTree, '/.vscode/settings.json');

    expect(extensions.get(['recommendations'])).toContain(
      'stylelint.vscode-stylelint',
    );

    expect(settings.get(['stylelint.validate'])).toEqual(['css', 'scss']);
  });

  it('should ignore existing VSCode config', async () => {
    const { runSchematic, tree } = await setup();

    // Add the stylelint extension before the schematic is ran.
    let extensions = new JsonFile(tree, '/.vscode/extensions.json');
    extensions.modify(['recommendations'], ['stylelint.vscode-stylelint']);

    const updatedTree = await runSchematic();

    extensions = new JsonFile(updatedTree, '/.vscode/extensions.json');

    expect(extensions.get(['recommendations'])).toEqual([
      'stylelint.vscode-stylelint',
    ]);
  });
});
