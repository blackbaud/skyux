import { Tree } from '@angular-devkit/schematics';

/**
 * Returns the contents of a required file or throws an error if it doesn't exist.
 */
export function readRequiredFile(tree: Tree, filePath: string): string {
  const data = tree.exists(filePath) && tree.readText(filePath);
  if (!data) {
    throw new Error(
      `The file '${filePath}' was expected to exist but was not found.`,
    );
  }

  return data;
}
