import { HostTree, Rule, Tree } from '@angular-devkit/schematics';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';

import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

interface RemoveNxCacheOptions {
  rootDir: string;
}

export function removeNxCache(options: RemoveNxCacheOptions): Rule {
  return (tree: Tree) => {
    if (
      HostTree.isHostTree(tree) &&
      existsSync(join(options.rootDir, '.git/HEAD'))
    ) {
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
