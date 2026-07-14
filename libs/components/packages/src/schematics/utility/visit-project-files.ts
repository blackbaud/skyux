import { normalize } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { FileVisitor } from '@angular-devkit/schematics/src/tree/interface';

const rootIgnore = ['dist', 'coverage'];
const alwaysIgnore = ['node_modules', '__skyux'];

export function visitProjectFiles(
  tree: Tree,
  projectPath: string,
  visitor: FileVisitor,
): void {
  tree.getDir(projectPath).visit((rawPath, entry) => {
    // Some schematics upstream of this (e.g. `@schematics/angular`'s `ng-new`)
    // can create tree entries using OS-native separators, which produces
    // backslash paths on Windows. Normalize to forward slashes so behavior
    // (and any messages built from the path) is consistent across platforms.
    const path = normalize(rawPath);

    if (
      path.includes('/.') ||
      rootIgnore.some((i) => path.startsWith(`/${i}/`)) ||
      alwaysIgnore.some((i) => path.includes(`/${i}/`))
    ) {
      return;
    }
    visitor(path, entry);
  });
}
