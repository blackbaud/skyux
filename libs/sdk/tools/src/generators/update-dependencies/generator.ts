import {
  Tree,
  formatFiles,
  getProjects,
  readJson,
  updateJson,
  updateProjectConfiguration,
  visitNotIgnoredFiles,
} from '@nx/devkit';
import { getSourceNodes } from '@nx/js';

import * as semver from 'semver';
import * as ts from 'typescript';

function hardenRootDependencies(tree: Tree): void {
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

function updatePeerDependencies(tree: Tree): void {
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

function updateNgUpdatePackageGroup(tree: Tree): void {
  const rootPackageJson = readJson(tree, 'package.json');
  const rootPackageJsonDependencies: Record<string, string> = {
    ...rootPackageJson.dependencies,
    ...rootPackageJson.devDependencies,
  };
  if (tree.exists('libs/components/packages/package.json')) {
    updateJson(tree, 'libs/components/packages/package.json', (json) => {
      const packageGroup = Object.entries<string>(
        json['ng-update']['packageGroup'],
      );
      packageGroup.forEach(([name, version]) => {
        if (version !== '0.0.0-PLACEHOLDER') {
          const rootVersion = rootPackageJsonDependencies[name];
          const prefix = version.match(`^[~^]`) ? version.charAt(0) : '';
          if (rootVersion) {
            json['ng-update']['packageGroup'][name] = `${prefix}${rootVersion}`;
          }
        }
      });
      return json;
    });
  }
}

/**
 * Testing projects do not have a separate package.json to track dependencies.
 */
function updateTestingImplicitDependencies(tree: Tree): void {
  const projects = getProjects(tree);
  const testingProjects = new Map(
    Array.from(projects.entries()).filter(([name]) =>
      name.endsWith('-testing'),
    ),
  );
  const packagesToProjects = new Map<string, string>();
  projects.forEach((projectConfig) => {
    const packageJsonFile = `${projectConfig.root}/package.json`;
    if (projectConfig.name && tree.exists(packageJsonFile)) {
      const packageJson = readJson(tree, packageJsonFile);
      if (packageJson.name) {
        if (testingProjects.has(`${projectConfig.name}-testing`)) {
          packagesToProjects.set(
            `${packageJson.name}/testing`,
            `${projectConfig.name}-testing`,
          );
        }
        packagesToProjects.set(packageJson.name, projectConfig.name);
      }
    }
  });
  const packages = Array.from(packagesToProjects.keys());
  testingProjects.forEach((projectConfig) => {
    const importedProjects: string[] = [];
    visitNotIgnoredFiles(tree, `${projectConfig.root}/src`, (file) => {
      if (file.endsWith('.ts')) {
        const source = ts.createSourceFile(
          file,
          tree.read(file, 'utf-8') || '',
          ts.ScriptTarget.Latest,
          true,
        );
        const sourceNodes = getSourceNodes(source);
        const importDeclarations = sourceNodes.filter((node) =>
          ts.isImportDeclaration(node),
        ) as ts.ImportDeclaration[];
        importDeclarations.forEach((importDeclaration) => {
          const importPath = importDeclaration.moduleSpecifier.getText();
          const importProject = packages.find(
            (packageName) =>
              importPath === `'${packageName}'` ||
              importPath.startsWith(`'${packageName}/`),
          );
          const projectName = packagesToProjects.get(importProject ?? '');
          if (importProject && projectName) {
            importedProjects.push(projectName);
          }
        });
      }
    });
    if (projectConfig.name) {
      projectConfig.targets ??= {};
      projectConfig.targets['build'] = {
        command: `echo ' 🏗️  build ${projectConfig.name}'`,
        dependsOn: [
          {
            projects: [projectConfig.name.replace('-testing', '')],
            target: 'build',
          },
        ],
      };
      if (importedProjects.length > 0) {
        projectConfig.implicitDependencies = [
          ...new Set(importedProjects),
        ].sort((a, b) => a.localeCompare(b));
      }
      updateProjectConfiguration(tree, projectConfig.name, projectConfig);
    }
  });
}

export default async function (tree: Tree) {
  hardenRootDependencies(tree);
  updatePeerDependencies(tree);
  updateNgUpdatePackageGroup(tree);
  updateTestingImplicitDependencies(tree);
  await formatFiles(tree);
}
