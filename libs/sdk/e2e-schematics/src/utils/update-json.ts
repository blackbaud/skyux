import { Tree, parseJson, serializeJson } from '@nrwl/devkit';

export function readJsonFile(tree: Tree, path: string) {
  const asString = tree.read(path, 'utf-8');
  return parseJson(asString);
}

function writeJsonFile(tree: Tree, path: string, data: unknown) {
  const asString = serializeJson(data as never);
  tree.write(path, asString);
}

export function updateJson<T>(tree: Tree, path: string, callback: (a: T) => T) {
  const json = readJsonFile(tree, path);
  callback(json);
  writeJsonFile(tree, path, json);
}
