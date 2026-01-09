import {
  ProjectConfiguration,
  Tree,
  formatFiles,
  generateFiles,
  getProjects,
  joinPathFragments,
  normalizePath,
  readJson,
  updateJson,
  updateProjectConfiguration,
  visitNotIgnoredFiles,
} from '@nx/devkit';
import { getSourceNodes } from '@nx/js';
import { relativePathToWorkspaceRoot } from '@schematics/angular/utility/paths';

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
    const excludedPackages = [
      '@skyux/packages',
      '@skyux-sdk/eslint-config',
      '@skyux-sdk/prettier-schematics',
    ];

    const npmPackages = Array.from(getProjects(tree).values())
      .filter((project) => !!project.tags?.includes('npm'))
      .map(
        (project) =>
          readJson(tree, joinPathFragments(project.root, 'package.json')).name,
      )
      .filter(Boolean)
      .map(String);
    updateJson(tree, 'libs/components/packages/package.json', (json) => {
      const packageGroup = Object.entries<string>({
        ...json['ng-update']['packageGroup'],
      })
        .concat(npmPackages.map((name) => [name, '0.0.0-PLACEHOLDER']))
        .filter(
          ([name], index, list) =>
            !excludedPackages.includes(name) &&
            index === list.findIndex(([n]) => n === name),
        );
      packageGroup.forEach(([name, version], index) => {
        if (!npmPackages.includes(name)) {
          const rootVersion = rootPackageJsonDependencies[name];
          const prefix = version.match(`^[~^]`) ? version.charAt(0) : '';
          if (rootVersion) {
            packageGroup[index][1] = `${prefix}${rootVersion}`;
          }
        }
      });
      packageGroup.sort(([a], [b]) => a.localeCompare(b));
      // @skyux/packages is first so it shows when running ng update.
      json['ng-update']['packageGroup'] = {
        '@skyux/packages': '0.0.0-PLACEHOLDER',
        ...Object.fromEntries(packageGroup),
      };
      return json;
    });
  }
}

function mapProjectsToPackages(
  projects: Map<string, ProjectConfiguration>,
  tree: Tree,
): Map<string, string> {
  const packagesToProjects = new Map<string, string>();
  projects.forEach((projectConfig) => {
    const packageJsonFile = `${projectConfig.root}/package.json`;
    if (projectConfig.name && tree.exists(packageJsonFile)) {
      const packageJson = readJson(tree, packageJsonFile);
      if (packageJson.name) {
        packagesToProjects.set(packageJson.name, projectConfig.name);
      }
    }
  });
  return packagesToProjects;
}

function getImportedProjects(
  tree: Tree,
  projectConfig: ProjectConfiguration,
  packagesToProjects: Map<string, string>,
): string[] {
  const importedProjects: string[] = [];
  const packages = Array.from(packagesToProjects.keys());
  visitNotIgnoredFiles(tree, `${projectConfig.root}/src`, (file) => {
    file = normalizePath(file);
    if (
      file.endsWith('.ts') &&
      !file.endsWith('.spec.ts') &&
      !file.includes('/fixtures/')
    ) {
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
        if (importProject && projectName && !projectName.endsWith('-testing')) {
          importedProjects.push(projectName);
        }
      });
    }
  });
  return [...new Set(importedProjects)].sort((a, b) => a.localeCompare(b));
}

/**
 * Testing projects do not have a separate package.json to track dependencies.
 */
function updateTestingBuildTargetDependencies(tree: Tree): void {
  const projects = getProjects(tree);
  const testingProjects = new Map<string, ProjectConfiguration>(
    Array.from(projects.entries()).filter(([name]) =>
      name.endsWith('-testing'),
    ),
  );
  const packagesToProjects = mapProjectsToPackages(projects, tree);
  testingProjects.forEach((projectConfig) => {
    const parentProjectName = `${projectConfig.name?.replace('-testing', '')}`;
    const importedProjects = getImportedProjects(
      tree,
      projectConfig,
      packagesToProjects,
    ).filter((projectName) => projectName !== parentProjectName);
    if (projectConfig.name) {
      const parentProject = projects.get(parentProjectName);
      if (parentProject) {
        if (parentProject?.targets?.['build']) {
          parentProject.targets['build'].dependsOn = [
            '^build',
            ...(importedProjects.length > 0
              ? [
                  {
                    projects: importedProjects,
                    target: 'build',
                  },
                ]
              : []),
          ];
          parentProject.targets['build'].inputs = [
            'buildInputs',
            '^buildInputs',
            `{workspaceRoot}/${projectConfig.root}/src/**/*`,
            `!{workspaceRoot}/${projectConfig.root}/src/**/*.spec.ts`,
            `!{workspaceRoot}/${projectConfig.root}/src/**/fixtures/**/*`,
          ];
        }
        updateProjectConfiguration(tree, parentProjectName, parentProject);
      }
      projectConfig.targets ??= {};
      projectConfig.targets['lint'] = {
        executor: '@nx/eslint:lint',
        options: {
          lintFilePatterns: ['{projectRoot}/src/**/*.ts'],
        },
      };
      updateProjectConfiguration(tree, projectConfig.name, projectConfig);
      generateFiles(tree, __dirname + '/files', projectConfig.root, {
        pathToRoot: relativePathToWorkspaceRoot(projectConfig.root),
        projectRoot: projectConfig.root,
      });
    }
  });
}

/**
 * TypeScript file changes that may affect the public API should trigger a manifest build.
 * This approach marks the files as the dependency rather than the build step of the libraries
 * so the manifest build does not need to wait for libraries to build.
 * The named input could be added to `nx.json`, but it's massive and only used here.
 */
function updateManifestBuildTargetDependencies(tree: Tree): void {
  const projects = getProjects(tree);
  const componentProjects = new Map<string, ProjectConfiguration>(
    Array.from(projects.entries()).filter(
      ([, config]) =>
        tree.exists(`${config.root}/documentation.json`) &&
        config.tags?.includes('component'),
    ),
  );
  const manifestProject = projects.get('manifest');
  if (!manifestProject) {
    return;
  }
  manifestProject.namedInputs ??= {};
  manifestProject.namedInputs['componentDocumentationInputs'] = Array.from(
    componentProjects.values(),
  ).flatMap((proj) => [
    `{workspaceRoot}/${proj.root}/**/*.ts`,
    `!{workspaceRoot}/${proj.root}/**/*.@(spec|stories).ts`,
    `!{workspaceRoot}/${proj.root}/**/fixtures/**/*`,
    `!{workspaceRoot}/${proj.root}/.storybook/**/*`,
    `!{workspaceRoot}/${proj.root}/jest.config.ts`,
    `!{workspaceRoot}/${proj.root}/src/test-setup.ts`,
  ]);
  updateProjectConfiguration(tree, 'manifest', manifestProject);
}

export default async function (
  tree: Tree,
  options: { skipFormat: boolean },
): Promise<void> {
  hardenRootDependencies(tree);
  updatePeerDependencies(tree);
  updateNgUpdatePackageGroup(tree);
  updateTestingBuildTargetDependencies(tree);
  updateManifestBuildTargetDependencies(tree);
  /* istanbul ignore if */
  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}
