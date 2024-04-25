import { Rule, Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

describe('removeNxCache', () => {
  async function setup(): Promise<{
    tree: UnitTestTree;
    mocks: {
      spawnSync: jest.Mock;
      existsSync: jest.Mock;
      getPackageJsonDependency: jest.Mock;
      isHostTree: jest.Mock;
    };
    removeNxCache: (options: { rootDir: string }) => Rule;
  }> {
    const mocks = {
      spawnSync: jest.fn(),
      existsSync: jest.fn().mockReturnValue(false),
      getPackageJsonDependency: jest.fn(),
      isHostTree: jest.fn().mockReturnValue(false),
    };
    jest.doMock('@schematics/angular/utility/dependencies', () => ({
      getPackageJsonDependency: mocks.getPackageJsonDependency,
    }));
    jest.doMock('child_process', () => ({
      spawnSync: mocks.spawnSync,
    }));
    jest.doMock('fs', () => ({
      existsSync: mocks.existsSync,
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
    removeNxCache({ rootDir: '.' })(tree, {
      logger: { info: jest.fn() },
    } as any);
    expect(tree.exists('.nx/cache')).toBe(false);
    expect(mocks.spawnSync).not.toHaveBeenCalled();
  });

  it('should ignore .nx/cache directory', async () => {
    const { tree, mocks, removeNxCache } = await setup();
    mocks.getPackageJsonDependency.mockReturnValueOnce({
      type: NodeDependencyType.Default,
      name: '@angular-eslint/builder',
      version: '1.0.0',
    });
    mocks.existsSync.mockReturnValueOnce(true);
    mocks.isHostTree.mockReturnValueOnce(true);
    removeNxCache({ rootDir: '.' })(tree, {} as any);
    expect(tree.exists('.nx/cache')).toBe(false);
    expect(mocks.spawnSync).toHaveBeenCalled();
    expect(tree.readContent('.gitignore')).toContain('.nx/cache');
  });
});
