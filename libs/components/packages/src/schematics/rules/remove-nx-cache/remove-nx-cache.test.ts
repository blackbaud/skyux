import { Rule, Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

describe('removeNxCache', () => {
  async function setup(): Promise<{
    tree: UnitTestTree;
    mocks: {
      spawnSync: jest.Mock;
      getPackageJsonDependency: jest.Mock;
      isHostTree: jest.Mock;
    };
    removeNxCache: (options: { rootDir: string }) => Rule;
  }> {
    const mocks = {
      spawnSync: jest.fn(),
      getPackageJsonDependency: jest.fn(),
      isHostTree: jest.fn().mockReturnValue(false),
    };
    jest.doMock('@schematics/angular/utility/dependencies', () => ({
      getPackageJsonDependency: mocks.getPackageJsonDependency,
    }));
    jest.doMock('child_process', () => ({
      spawnSync: mocks.spawnSync,
    }));
    jest.doMock('@angular-devkit/schematics', () => ({
      HostTree: {
        isHostTree: mocks.isHostTree,
      },
    }));
    const tree = new UnitTestTree(Tree.empty());
    tree.create('.gitignore', '');
    tree.create('package.json', '{}');
    const { removeNxCache } = await import('./remove-nx-cache');
    return {
      tree,
      mocks,
      removeNxCache,
    };
  }

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should do nothing', async () => {
    const { tree, mocks, removeNxCache } = await setup();

    await removeNxCache({ rootDir: '.' })(tree, {
      logger: { info: jest.fn() },
    } as any);

    expect(tree.exists('.nx/cache')).toBe(false);
    expect(mocks.spawnSync).not.toHaveBeenCalled();
  });

  it('should do nothing if not in a git repo', async () => {
    const { tree, mocks, removeNxCache } = await setup();
    mocks.isHostTree.mockReturnValueOnce(true);
    mocks.spawnSync.mockImplementationOnce(() => {
      throw new Error();
    });

    await removeNxCache({ rootDir: '.' })(tree, {
      logger: { info: jest.fn() },
    } as any);

    expect(tree.exists('.nx/cache')).toBe(false);
    expect(mocks.spawnSync).toHaveBeenCalledTimes(1);
    expect(mocks.spawnSync).toHaveBeenCalledWith(
      'git',
      ['-C', '.', 'rev-parse', '--quiet', '--verify', 'HEAD'],
      {
        stdio: 'ignore',
      },
    );
  });

  it('should ignore .nx directory', async () => {
    const { tree, mocks, removeNxCache } = await setup();
    mocks.getPackageJsonDependency.mockReturnValueOnce({
      type: NodeDependencyType.Default,
      name: '@angular-eslint/builder',
      version: '1.0.0',
    });
    mocks.isHostTree.mockReturnValueOnce(true);

    await removeNxCache({ rootDir: '.' })(tree, {} as any);

    expect(tree.exists('.nx/cache')).toBe(false);
    expect(mocks.spawnSync).toHaveBeenCalledTimes(2);
    expect(mocks.spawnSync).toHaveBeenCalledWith(
      'git',
      ['-C', '.', 'rm', '-rf', '--cached', '--quiet', '.nx'],
      {
        stdio: 'ignore',
      },
    );
    expect(tree.readContent('.gitignore')).toContain('/.nx');
  });

  it('should update ignore from .nx/cache directory', async () => {
    const { tree, mocks, removeNxCache } = await setup();
    mocks.getPackageJsonDependency.mockReturnValueOnce({
      type: NodeDependencyType.Default,
      name: '@angular-eslint/builder',
      version: '1.0.0',
    });
    mocks.isHostTree.mockReturnValueOnce(true);
    tree.overwrite('.gitignore', `/.nx/cache`);

    await removeNxCache({ rootDir: '.' })(tree, {} as any);

    expect(tree.exists('.nx/cache')).toBe(false);
    expect(mocks.spawnSync).toHaveBeenCalledTimes(2);
    expect(mocks.spawnSync).toHaveBeenCalledWith(
      'git',
      ['-C', '.', 'rm', '-rf', '--cached', '--quiet', '.nx'],
      {
        stdio: 'ignore',
      },
    );
    expect(tree.readContent('.gitignore')).toContain('/.nx');
    expect(tree.readContent('.gitignore')).not.toContain('.nx/cache');
  });
});
