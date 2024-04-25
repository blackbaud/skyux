import { HostTree, Rule, Tree } from '@angular-devkit/schematics';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';

import { spawnSync } from 'child_process';

interface RemoveNxCacheOptions {
  rootDir: string;
}

function isGitPath(path: string): boolean {
  try {
    spawnSync('git', ['-C', path, 'rev-parse', '--quiet', '--verify', 'HEAD'], {
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    return false;
  }
}

export function removeNxCache(options: RemoveNxCacheOptions): Rule {
  return (tree: Tree) => {
    if (HostTree.isHostTree(tree) && isGitPath(options.rootDir)) {
      spawnSync(
        'git',
        [
          '-C',
          options.rootDir,
          'rm',
          '-rf',
          '--cached',
          '--quiet',
          '.nx/cache',
        ],
        {
          stdio: 'ignore',
        },
      );
    }
    const hasEsLint = getPackageJsonDependency(tree, '@angular-eslint/builder');
    if (hasEsLint) {
      const gitIgnore = tree.readText('.gitignore');
      if (!gitIgnore?.includes('.nx/cache')) {
        const recorder = tree.beginUpdate('.gitignore');
        recorder.insertLeft(
          0,
          `# Ignore cache directory used by @angular-eslint/builder\n/.nx/cache\n\n`,
        );
        tree.commitUpdate(recorder);
      }
    }
  };
}
