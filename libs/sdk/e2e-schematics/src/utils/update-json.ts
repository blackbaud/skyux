import { Tree, parseJson, serializeJson } from '@nx/devkit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readJsonFile(tree: Tree, path: string): any {
  const asString = tree.read(path, 'utf-8');

  if (asString) {
    return parseJson(asString);
  } else {
    return {};
  }
}

function writeJsonFile(tree: Tree, path: string, data: unknown): void {
  const asString = serializeJson(data as never);
  tree.write(path, asString);
}

export function updateJson<T>(
  tree: Tree,
  path: string,
  callback: (a: T) => T,
): void {
  const json = readJsonFile(tree, path);
  callback(json);
  writeJsonFile(tree, path, json);
}
