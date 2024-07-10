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

const UPDATE_TO_VERSION = '31.3.2';

describe('ag-grid-migrate.schematic', () => {
  async function setupTest(): Promise<TestSetup> {
    const os = {
      platform: jest.fn().mockReturnValue('test'),
    };
    const childProcess = {
      spawnSync: jest.fn().mockReturnValue({ stdout: { toString: () => '' } }),
    };
    const context = {
      logger: {
        info: jest.fn(),
      } as unknown as logging.LoggerApi,
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
    const { os, childProcess, context, schematic } = await setupTest();

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

  it('should run migrate command on win32', async () => {
    const { os, childProcess, context, schematic } = await setupTest();
    childProcess.spawnSync.mockReturnValueOnce({
      stdout: { toString: () => 'file.ts' },
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
      ['install', '--no-save', `@ag-grid-community/cli@${UPDATE_TO_VERSION}`],
      {
        stdio: 'ignore',
        windowsVerbatimArguments: true,
      },
    );
  });

  it('should run migrate command on non-win32 machines', async () => {
    const { os, childProcess, context, schematic } = await setupTest();
    childProcess.spawnSync.mockReturnValueOnce({
      stdout: { toString: () => 'file.ts' },
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
      ['install', '--no-save', `@ag-grid-community/cli@${UPDATE_TO_VERSION}`],
      {
        stdio: 'ignore',
        windowsVerbatimArguments: true,
      },
    );
  });

  it('should not run if no files match', async () => {
    const { os, childProcess, context, schematic } = await setupTest();
    childProcess.spawnSync.mockReturnValueOnce({
      stdout: { toString: () => 'file.ts' },
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
});
