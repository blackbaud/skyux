import {join, Path, relative} from '@angular-devkit/core';
import {
  Tree,
  formatFiles,
  getProjects,
  updateProjectConfiguration,
  updateJson, readJson,
} from '@nrwl/devkit';
import * as semver from 'semver';

import { TargetConfiguration } from 'nx/src/config/workspace-json-project-json';
import {NgPackageConfig} from "ng-packagr/ng-package.schema";
import { ok } from 'node:assert';

function setStylesheetImportPathOnLibraries(tree: Tree) {
  getProjects(tree).forEach((projectConfig) => {
    if (
      projectConfig.name &&
      projectConfig.projectType === 'library' &&
      projectConfig.targets?.build?.executor === '@nrwl/angular:package' &&
      projectConfig.targets?.build?.options?.project.includes('ng-package.json') &&
      tree.isFile(projectConfig.targets.build.options.project)
    ) {
      updateJson(tree, projectConfig.targets.build.options.project, (json: NgPackageConfig) => {
        if (!json.inlineStyleLanguage) {
          json.inlineStyleLanguage = 'scss';
        }
        if (json.inlineStyleLanguage === 'scss') {
          const root = <Path>'/';
          const pathToRoot = relative(join(root, projectConfig.root), root);
          ok(json.lib, 'ng-package.json must have a lib property');
          json.lib.styleIncludePaths = json.lib.styleIncludePaths || [];
          if (!json.lib.styleIncludePaths.includes(pathToRoot)) {
            json.lib.styleIncludePaths.push(pathToRoot);
          }
        }
        return json;
      });
    }
  });
}

function addPolyfillsToTarget(target: TargetConfiguration) {
  if (!target.options.polyfills) {
    target.options.polyfills = [];
  } else if (!(target.options?.polyfills instanceof Array)) {
    target.options.polyfills = [target.options.polyfills];
  }
  ['zone.js', 'zone.js/testing'].forEach((polyfill) => {
    if (!target.options.polyfills.includes(polyfill)) {
      target.options.polyfills.push(polyfill);
    }
  });
}

function addPolyfillsToProjectConfigTestTargets(tree: Tree) {
  getProjects(tree).forEach((projectConfig) => {
    if (projectConfig.name) {
      if (
        projectConfig.targets?.test?.executor ===
        '@angular-devkit/build-angular:karma'
      ) {
        addPolyfillsToTarget(projectConfig.targets.test);
      }
      updateProjectConfiguration(tree, projectConfig.name, projectConfig);
    }
  });
}

function removePolyfillsFromTestTs(tree: Tree) {
  getProjects(tree).forEach((projectConfig) => {
    if (projectConfig.name) {
      if (
        projectConfig.targets?.test?.executor ===
        '@angular-devkit/build-angular:karma'
      ) {
        const testTsPath = `${projectConfig.root}/src/test.ts`;
        if (tree.exists(testTsPath)) {
          const testTs = `${tree.read(testTsPath, 'utf-8')}`;
          const originalTestTs = testTs;
          const updatedTestTs = testTs.replace(
            /import 'zone.js\/(dist\/)?zone(-testing)?';\n?/g,
            ''
          );
          if (originalTestTs !== updatedTestTs) {
            tree.write(testTsPath, updatedTestTs);
          }
        }
      }
    }
  });
}

function updatePeerDependencies(tree: Tree) {
  const rootPackageJson = readJson(tree, 'package.json');
  const rootPackageJsonDependencies = {
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
                  if (dependencyType === 'peerDependencies' && `${version}`.match(/^\^[0-9]+\.[0-9]+\.[0-9]+$/)) {
                    dependencies[name] = `^${rootVersion}`;
                  } else if (!semver.satisfies(rootVersion, `${version}`)) {
                    throw new Error(
                      `The version of ${name} in ${projectConfig.root} (${version}) is not compatible with the version ${rootVersion} from the root package.json.`
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
  setStylesheetImportPathOnLibraries(tree);
  addPolyfillsToProjectConfigTestTargets(tree);
  removePolyfillsFromTestTs(tree);
  updatePeerDependencies(tree);
  await formatFiles(tree);
}
