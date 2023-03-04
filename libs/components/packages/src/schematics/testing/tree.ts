import { UnitTestTree } from '@angular-devkit/schematics/testing';

export function readJson(tree: UnitTestTree, filePath: string): any {
  return JSON.parse(tree.readContent(filePath));
}
