import { UnitTestTree } from '@angular-devkit/schematics/testing';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readJson(tree: UnitTestTree, filePath: string): any {
  return JSON.parse(tree.readContent(filePath));
}
