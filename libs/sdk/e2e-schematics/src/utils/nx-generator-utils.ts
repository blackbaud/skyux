import { Tree, getProjects } from '@nrwl/devkit';

import { readJsonFile } from './update-json';

export function getGeneratorDefaults(
  tree: Tree,
  collectionName: string,
  generatorName: string,
  projectName: string | null
) {
  const nxConfig = readJsonFile(tree, 'nx.json');
  const projects = getProjects(tree);
  let defaults = {};
  if (nxConfig?.generators) {
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
    const g = projects.get(projectName).generators;
    if (g[collectionName] && g[collectionName][generatorName]) {
      defaults = { ...defaults, ...g[collectionName][generatorName] };
    }
    if (g[`${collectionName}:${generatorName}`]) {
      defaults = {
        ...defaults,
        ...g[`${collectionName}:${generatorName}`],
      };
    }
  }
  return defaults;
}
