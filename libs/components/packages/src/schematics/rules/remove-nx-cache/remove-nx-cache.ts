import { HostTree, Rule, Tree } from '@angular-devkit/schematics';

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
        ['-C', options.rootDir, 'rm', '-rf', '--cached', '--quiet', '.nx'],
        {
          stdio: 'ignore',
        },
      );
    }
    const gitIgnore = tree.readText('.gitignore');
    const ignoreStatement = gitIgnore?.match(/^(\/?\.nx)\/cache$/m);
    const recorder = tree.beginUpdate('.gitignore');
    if (ignoreStatement?.index !== undefined) {
      recorder.remove(ignoreStatement.index + ignoreStatement[1].length, 6);
    } else if (!gitIgnore?.match(/^\/?\.nx$/m)) {
      recorder.insertLeft(
        0,
        `# Ignore cache directory used by @angular-eslint/builder\n/.nx\n\n`,
      );
    }
    tree.commitUpdate(recorder);
  };
}
