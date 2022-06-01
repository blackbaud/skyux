import { Tree, parseJson, serializeJson } from '@nrwl/devkit';

function readJsonFile(tree: Tree, path: string) {
  const asString = tree.read(path, 'utf-8');
  return parseJson(asString);
}

function writeJsonFile(tree: Tree, path: string, data: any) {
  const asString = serializeJson(data);
  tree.write(path, asString);
}

export function updateJson(
  tree: Tree,
  path: string,
  callback: (a: any) => any
) {
  const json = readJsonFile(tree, path);
  callback(json);
  writeJsonFile(tree, path, json);
}
