import { UnitTestTree } from '@angular-devkit/schematics/testing';

/**
 * Returns JSON contents with a typeof 'any'.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readJson(tree: UnitTestTree, filePath: string): any {
  return tree.readJson(filePath);
}
