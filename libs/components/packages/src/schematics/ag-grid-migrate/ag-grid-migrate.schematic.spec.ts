import { logging } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';

import fs from 'fs-extra';
import { joinPathFragments } from 'nx/src/utils/path';
import { workspaceRoot } from 'nx/src/utils/workspace-root';

import { Schema } from './schema';

interface TestSetup {
  os: {
    platform: jest.Mock;
  };
  childProcess: {
    spawnSync: jest.Mock;
  };
  context: SchematicContext;
  schematic: (options: Schema) => Rule;
}

const UPDATE_TO_VERSION = '33.3.2';
const UPDATE_TO_MIGRATION = '33.0.0';

describe('ag-grid-migrate.schematic', () => {
  const defaultSetup = {
    fileList: '',
    sourceRoot: '.',
    startingVersion: UPDATE_TO_VERSION,
    debug: false,
  };
  type Setup = typeof defaultSetup;
  async function setupTest(setupOptions?: Partial<Setup>): Promise<TestSetup> {
    const setup: Required<Setup> = { ...defaultSetup, ...setupOptions };
    const os = {
      platform: jest.fn().mockReturnValue('test'),
    };
    const childProcess = {
      spawnSync: jest
        .fn()
        .mockImplementation((cmd: string, args?: string[]) => {
          if (
            cmd === 'git' &&
            args?.join(' ') ===
              // eslint-disable-next-line @cspell/spellchecker
              `cat-file --textconv HEAD:${setup.sourceRoot}/package-lock.json`
          ) {
            return {
              stdout: JSON.stringify({
                packages: {
                  'node_modules/ag-grid-community': {
                    version: setup.startingVersion,
                  },
                },
              }),
            };
          }
          if (
            cmd === 'git' &&
            args?.join(' ') === `ls-files ${setup.sourceRoot}/**/*.ts`
          ) {
            return {
              stdout: setup.fileList,
            };
          }
          if (cmd.startsWith('npm') || cmd === 'node') {
            return {
              stdout: '',
            };
          }
          throw new Error(`Unexpected command: ${cmd} ${args?.join(' ')}`);
        }),
    };
    const context = {
      logger: {
        info: jest.fn(),
      } as unknown as logging.LoggerApi,
      debug: setup.debug,
    } as SchematicContext;

    jest.doMock('os', () => os);
    jest.doMock('child_process', () => childProcess);

    const { default: schematic } = await import('./ag-grid-migrate.schematic');

    return { os, childProcess, context, schematic };
  }

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should test the current version', () => {
    const packageJson = fs.readJSONSync(
      joinPathFragments(workspaceRoot, 'package.json'),
    );
    expect(packageJson.dependencies['ag-grid-community']).toBe(
      UPDATE_TO_VERSION,
    );
  });

  it('should run successfully', async () => {
    const { os, childProcess, context, schematic } = await setupTest({
      sourceRoot: 'sourceRoot',
    });

    const tree = new UnitTestTree(Tree.empty());
    const options = {
      from: '29.1.0',
      sourceRoot: 'sourceRoot',
    };

    await schematic(options)(tree, context);

    expect(context.logger.info).toHaveBeenCalledWith(
      '🏁 Migrating AG Grid code in sourceRoot...',
    );
    expect(childProcess.spawnSync).toHaveBeenCalledWith('git', [
      'ls-files',
      'sourceRoot/**/*.ts',
    ]);
    expect(context.logger.info).toHaveBeenCalledWith(
      'No AG Grid files found in sourceRoot',
    );
    expect(os.platform).not.toHaveBeenCalled();
  });

  it('should noop if the current version is current', async () => {
    const { context, schematic } = await setupTest();
    const tree = new UnitTestTree(Tree.empty());
    await schematic({})(tree, context);
    expect(context.logger.info).toHaveBeenCalledWith(
      `✅ Already on AG Grid ${UPDATE_TO_VERSION}. No migration needed.`,
    );
  });

  it('should run migrate command on win32', async () => {
    const { os, childProcess, context, schematic } = await setupTest({
      fileList: 'file.ts',
      sourceRoot: 'sourceRoot',
      startingVersion: '29.1.0',
    });
    os.platform.mockReturnValue('win32');

    const tree = new UnitTestTree(Tree.empty());
    tree.create('file.ts', 'content ag-grid');
    const options = {
      sourceRoot: 'sourceRoot',
    };

    await schematic(options)(tree, context);

    expect(context.logger.info).toHaveBeenCalledWith(
      '🏁 Migrating AG Grid code in sourceRoot...',
    );
    expect(childProcess.spawnSync).toHaveBeenCalledWith('git', [
      'ls-files',
      'sourceRoot/**/*.ts',
    ]);
    expect(os.platform).toHaveBeenCalled();
    expect(childProcess.spawnSync).toHaveBeenCalledWith(
      'npm.cmd',
      ['install', '--no-save', `@ag-grid-devtools/cli@~${UPDATE_TO_MIGRATION}`],
      {
        stdio: 'ignore',
        windowsVerbatimArguments: true,
      },
    );
    expect(childProcess.spawnSync).toHaveBeenCalledWith(
      'npm.cmd',
      ['remove', `@ag-grid-devtools/cli`],
      { stdio: 'ignore' },
    );
  });

  it('should run migrate command on non-win32 machines', async () => {
    const { os, childProcess, context, schematic } = await setupTest({
      fileList: 'file.ts',
      sourceRoot: 'sourceRoot',
      startingVersion: '29.1.0',
    });

    const tree = new UnitTestTree(Tree.empty());
    tree.create('file.ts', 'content ag-grid');
    const options = {
      sourceRoot: 'sourceRoot',
    };

    await schematic(options)(tree, context);

    expect(context.logger.info).toHaveBeenCalledWith(
      '🏁 Migrating AG Grid code in sourceRoot...',
    );
    expect(childProcess.spawnSync).toHaveBeenCalledWith('git', [
      'ls-files',
      'sourceRoot/**/*.ts',
    ]);
    expect(os.platform).toHaveBeenCalled();
    expect(childProcess.spawnSync).toHaveBeenCalledWith(
      'npm',
      ['install', '--no-save', `@ag-grid-devtools/cli@~${UPDATE_TO_MIGRATION}`],
      {
        stdio: 'ignore',
        windowsVerbatimArguments: true,
      },
    );
    expect(childProcess.spawnSync).toHaveBeenCalledWith(
      'npm',
      ['remove', `@ag-grid-devtools/cli`],
      { stdio: 'ignore' },
    );
  });

  it('should run migrate command with debug', async () => {
    const { os, childProcess, context, schematic } = await setupTest({
      fileList: 'file.ts',
      sourceRoot: 'sourceRoot',
      startingVersion: '29.1.0',
      debug: true,
    });

    const tree = new UnitTestTree(Tree.empty());
    tree.create('file.ts', 'content ag-grid');
    const options = {
      sourceRoot: 'sourceRoot',
    };

    await schematic(options)(tree, context);

    expect(context.logger.info).toHaveBeenCalledWith(
      '🏁 Migrating AG Grid code in sourceRoot...',
    );
    expect(childProcess.spawnSync).toHaveBeenCalledWith('git', [
      'ls-files',
      'sourceRoot/**/*.ts',
    ]);
    expect(os.platform).toHaveBeenCalled();
    expect(childProcess.spawnSync).toHaveBeenCalledWith(
      'npm',
      ['install', '--no-save', `@ag-grid-devtools/cli@~${UPDATE_TO_MIGRATION}`],
      {
        stdio: 'ignore',
        windowsVerbatimArguments: true,
      },
    );
    expect(childProcess.spawnSync).toHaveBeenCalledWith(
      'npm',
      ['remove', `@ag-grid-devtools/cli`],
      { stdio: 'ignore' },
    );
  });

  it('should not run if no files match', async () => {
    const { os, childProcess, context, schematic } = await setupTest({
      fileList: 'file.ts',
      sourceRoot: 'sourceRoot',
      startingVersion: '29.1.0',
    });

    const tree = new UnitTestTree(Tree.empty());
    const options = {
      sourceRoot: 'sourceRoot',
    };

    await schematic(options)(tree, context);

    expect(context.logger.info).toHaveBeenCalledWith(
      '🏁 Migrating AG Grid code in sourceRoot...',
    );
    expect(childProcess.spawnSync).toHaveBeenCalledWith('git', [
      'ls-files',
      'sourceRoot/**/*.ts',
    ]);
    expect(context.logger.info).toHaveBeenCalledWith(
      'No AG Grid files found in sourceRoot',
    );
    expect(os.platform).not.toHaveBeenCalled();
  });

  it('should not run if unable to read previous version', async () => {
    const { childProcess, context, schematic } = await setupTest();

    const tree = new UnitTestTree(Tree.empty());
    const options = {
      sourceRoot: 'sourceRoot',
    };
    childProcess.spawnSync.mockImplementation(() => {
      throw new Error('error');
    });

    await schematic(options)(tree, context);

    expect(context.logger.info).not.toHaveBeenCalled();
  });
});
