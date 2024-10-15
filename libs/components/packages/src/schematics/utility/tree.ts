import { virtualFs } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';

/**
 * Returns the contents of a required file or throws an error if it doesn't exist.
 */
export function readRequiredFile(tree: Tree, filePath: string): string {
  const data = tree.read(filePath);
  if (!data) {
    throw new Error(
      `The file '${filePath}' was expected to exist but was not found.`,
    );
  }

  return virtualFs.fileBufferToString(data);
}

export function writeTextFile(
  tree: Tree,
  path: string,
  contents: string,
): void {
  if (tree.exists(path)) {
    tree.overwrite(path, contents);
  } else {
    tree.create(path, contents);
  }
}

export function writeJsonFile<T>(tree: Tree, path: string, contents: T): void {
  writeTextFile(tree, path, JSON.stringify(contents, undefined, 2));
}
