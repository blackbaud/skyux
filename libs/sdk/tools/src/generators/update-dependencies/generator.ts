import {
  Tree,
  formatFiles,
  getProjects,
  readJson,
  updateJson,
} from '@nrwl/devkit';

import * as semver from 'semver';

function hardenRootDependencies(tree: Tree) {
  updateJson(tree, 'package.json', (json) => {
    ['dependencies', 'devDependencies'].forEach((dependencyType) => {
      if (dependencyType in json) {
        const dependencies = json[dependencyType];
        for (const [name, version] of Object.entries<string>(dependencies)) {
          if (`${version}`.match(/^[~^][0-9]+\.[0-9]+\.[0-9]+$/)) {
            json[dependencyType][name] = version.substring(1);
          }
        }
      }
    });
    return json;
  });
}

function updatePeerDependencies(tree: Tree) {
  const rootPackageJson = readJson(tree, 'package.json');
  const rootPackageJsonDependencies: Record<string, string> = {
    ...rootPackageJson.dependencies,
    ...rootPackageJson.devDependencies,
  };
  getProjects(tree).forEach((projectConfig) => {
    if (tree.exists(`${projectConfig.root}/package.json`)) {
      updateJson(tree, `${projectConfig.root}/package.json`, (json) => {
        ['dependencies', 'peerDependencies'].forEach((dependencyType) => {
          if (dependencyType in json) {
            const dependencies = json[dependencyType];
            for (const [name, version] of Object.entries(dependencies)) {
              if (name in rootPackageJsonDependencies) {
                const rootVersion = rootPackageJsonDependencies[name];
                if (`${rootVersion}`.match(/^[0-9]+\.[0-9]+\.[0-9]+$/)) {
                  if (
                    dependencyType === 'peerDependencies' &&
                    `${version}`.match(/^\^[0-9]+\.[0-9]+\.[0-9]+$/)
                  ) {
                    json[dependencyType][name] = `^${rootVersion}`;
                  } else if (!semver.satisfies(rootVersion, `${version}`)) {
                    throw new Error(
                      `The version of ${name} in ${projectConfig.root} (${version}) is not compatible with the version ${rootVersion} from the root package.json.`,
                    );
                  }
                }
              }
            }
          }
        });
        return json;
      });
    }
  });
}

export default async function (tree: Tree) {
  hardenRootDependencies(tree);
  updatePeerDependencies(tree);
  await formatFiles(tree);
}
