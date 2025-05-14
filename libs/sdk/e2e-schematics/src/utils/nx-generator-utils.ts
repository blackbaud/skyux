import { Tree, getProjects } from '@nx/devkit';

import { readJsonFile } from './update-json';

export function getGeneratorDefaults(
  tree: Tree,
  collectionName: string,
  generatorName: string,
  projectName: string | null,
): unknown {
  const nxConfig = readJsonFile(tree, 'nx.json');
  const projects = getProjects(tree);
  let defaults = {};
  if (nxConfig.generators) {
    if (nxConfig.generators[collectionName]?.[generatorName]) {
      defaults = {
        ...defaults,
        ...nxConfig.generators[collectionName][generatorName],
      };
    }
    if (nxConfig.generators[`${collectionName}:${generatorName}`]) {
      defaults = {
        ...defaults,
        ...nxConfig.generators[`${collectionName}:${generatorName}`],
      };
    }
  }
  if (projectName && projects.get(projectName)?.generators) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const g = projects.get(projectName)!.generators;
    if (g && g[collectionName] && g[collectionName][generatorName]) {
      defaults = { ...defaults, ...g[collectionName][generatorName] };
    }
    if (g && g[`${collectionName}:${generatorName}`]) {
      defaults = {
        ...defaults,
        ...g[`${collectionName}:${generatorName}`],
      };
    }
  }
  return defaults;
}
