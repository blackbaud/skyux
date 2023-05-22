import { SchematicsAngularApplicationStyle } from '@angular/cli/lib/config/workspace-schema';
import { applicationGenerator } from '@nx/angular/generators';
import {
  ProjectConfiguration,
  Tree,
  formatFiles,
  generateFiles,
  getProjects,
  installPackagesTask,
  joinPathFragments,
  logger,
  readJson,
  readProjectConfiguration,
  removeDependenciesFromPackageJson,
  updateJson,
  updateProjectConfiguration,
} from '@nx/devkit';
import { addDependenciesToPackageJson } from '@nx/devkit/src/utils/package-json';
import { Linter } from '@nx/linter';
import { configurationGenerator } from '@nx/storybook';
import { moveGenerator } from '@nx/workspace';

import configurePercy from '../configure-percy';
import configureStorybook from '../configure-storybook';
import storiesGenerator from '../stories';

import { NormalizedSchema, Schema } from './schema';

const BASE_PATH = 'e2e';

function normalizeOptions(options: Partial<Schema>): NormalizedSchema {
  if (!options.name) {
    throw new Error(`Please provide the component library name`);
  }

  const parsedTags = (
    options.tags ? options.tags.split(',').map((s) => s.trim()) : []
  ).concat(['component-e2e']);

  return {
    name: options.name,
    prefix: 'app',
    storybookAppName: `${options.name}-storybook`,
    routing: true,
    strict: false,
    style: SchematicsAngularApplicationStyle.Scss,
    parsedTags,
    tags: parsedTags.join(','),
    ansiColor: options.ansiColor !== false,
  };
}

/**
 * Drop the BASE_PATH from the project name and re-sort the projects.
 */
function simplifyWorkspaceName(tree: Tree, projectName: string) {
  const projects = getProjects(tree);
  projects.forEach((projectConfig) => {
    let projectConfigJson = JSON.stringify(projectConfig).replace(
      new RegExp(`${BASE_PATH}-${projectName}`, 'g'),
      projectName
    );
    if (projectName.endsWith('-e2e')) {
      const withoutE2e = projectName.replace(/-e2e$/, '');
      projectConfigJson = projectConfigJson.replace(
        new RegExp(`${BASE_PATH}-${withoutE2e}`, 'g'),
        withoutE2e
      );
    }
    updateProjectConfiguration(
      tree,
      `${BASE_PATH}-${projectName}`,
      JSON.parse(projectConfigJson)
    );
  });
}

/**
 * Add the packages polyfills to the build and test targets.
 */
function addPackagesPolyfills(tree: Tree, projectName: string) {
  const polyfillsBuilders = [
    '@angular-devkit/build-angular:browser',
    '@angular-devkit/build-angular:karma',
    '@blackbaud-internal/skyux-angular-builders:browser',
    '@blackbaud-internal/skyux-angular-builders:karma',
  ];
  const projects = getProjects(tree);
  const projectConfig = projects.get(projectName);
  if (projectConfig) {
    let hasChanged = false;
    ['build', 'test'].forEach((target) => {
      if (
        polyfillsBuilders.includes(
          `${projectConfig.targets?.[target].executor}`
        ) &&
        projectConfig.targets?.[target].options.polyfills &&
        Array.isArray(projectConfig.targets[target].options.polyfills)
      ) {
        projectConfig.targets[target].options.polyfills.push(
          'libs/components/packages/src/polyfills.js'
        );
        hasChanged = true;
      }
    });
    if (hasChanged) {
      updateProjectConfiguration(tree, projectName, projectConfig);
    }
  }
}

/**
 * - Generates -storybook and -storybook-e2e projects for a component library if they don't already exist.
 * - Applies configuration to the projects.
 * - Generates stories and tests if there are demonstration components in the -storybook project.
 */
export default async function (tree: Tree, schema: Partial<Schema>) {
  const options = normalizeOptions(schema);

  let createProject = false;
  let moveProject = false;
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let projectConfig: ProjectConfiguration;
  let e2eProjectConfig: ProjectConfiguration;
  try {
    projectConfig = readProjectConfiguration(tree, options.storybookAppName);
    if (projectConfig.root === `apps/${options.storybookAppName}`) {
      moveProject = true;
      await moveGenerator(tree, {
        projectName: options.storybookAppName,
        destination: `${BASE_PATH}/${options.storybookAppName}`,
        updateImportPath: false,
        skipFormat: true,
      });
      simplifyWorkspaceName(tree, options.storybookAppName);
      projectConfig = readProjectConfiguration(tree, options.storybookAppName);
    }
    e2eProjectConfig = readProjectConfiguration(
      tree,
      `${options.storybookAppName}-e2e`
    );
    if (e2eProjectConfig.root === `apps/${options.storybookAppName}-e2e`) {
      moveProject = true;
      await moveGenerator(tree, {
        projectName: `${options.storybookAppName}-e2e`,
        destination: `${BASE_PATH}/${options.storybookAppName}-e2e`,
        updateImportPath: false,
        skipFormat: true,
      });
      simplifyWorkspaceName(tree, `${options.storybookAppName}-e2e`);
      e2eProjectConfig = readProjectConfiguration(
        tree,
        `${options.storybookAppName}-e2e`
      );
    }
    if (!moveProject) {
      (schema.ansiColor === false ? console.warn : logger.warn)(
        `The project "${options.storybookAppName}" already exists.`
      );
    }
  } catch (e) {
    createProject = true;
    await applicationGenerator(tree, {
      name: options.storybookAppName,
      tags: options.tags,
      style: options.style,
      routing: options.routing,
      strict: options.strict,
      prefix: options.prefix,
      directory: BASE_PATH,
      skipPackageJson: true,
      standaloneConfig: true,
      standalone: false,
    });
    simplifyWorkspaceName(tree, options.storybookAppName);
    simplifyWorkspaceName(tree, `${options.storybookAppName}-e2e`);
    addPackagesPolyfills(tree, options.storybookAppName);
    projectConfig = readProjectConfiguration(tree, options.storybookAppName);
    e2eProjectConfig = readProjectConfiguration(
      tree,
      `${options.storybookAppName}-e2e`
    );

    // Delete boilerplate files from the storybook project.
    let indexFile = tree.read(`${projectConfig.sourceRoot}/index.html`, 'utf8');

    // istanbul ignore if
    if (!indexFile) {
      indexFile = '';
    }

    indexFile = indexFile.replace(
      '<link rel="icon" type="image/x-icon" href="favicon.ico" />',
      ''
    );
    tree.write(`${projectConfig.sourceRoot}/index.html`, indexFile);
    [
      'favicon.ico',
      'assets/.gitkeep',
      'app/app.module.ts',
      'app/app.component.scss',
      'app/app.component.html',
      'app/app.component.spec.ts',
      'app/app.component.ts',
      'app/nx-welcome.component.ts',
    ].forEach((file) => tree.delete(`${projectConfig.sourceRoot}/${file}`));
    ['e2e/app.cy.ts', 'fixtures/example.json', 'support/app.po.ts'].forEach(
      (file) => tree.delete(`${e2eProjectConfig.sourceRoot}/${file}`)
    );
    // Create an empty app.
    generateFiles(
      tree,
      joinPathFragments(__dirname, 'files/app'),
      `${projectConfig.sourceRoot}/app`,
      {}
    );
    tree.write(`${e2eProjectConfig.sourceRoot}/e2e/.gitkeep`, ``);
  }

  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  if (
    createProject ||
    !(
      tree.isFile(`${projectConfig.root}/.storybook/main.js`) ||
      tree.isFile(`${projectConfig.root}/.storybook/main.ts`)
    )
  ) {
    await configurationGenerator(tree, {
      name: options.storybookAppName,
      uiFramework: '@storybook/angular',
      configureCypress: true,
      linter: Linter.EsLint,
    });
  } else if (!moveProject) {
    await storiesGenerator(tree, {
      project: options.storybookAppName,
      cypressProject: `${options.storybookAppName}-e2e`,
      generateCypressSpecs: true,
    });
  }
  if (!moveProject) {
    await configureStorybook(tree, { name: options.storybookAppName });
    await configurePercy(tree, { name: `${options.storybookAppName}-e2e` });
  }

  // @storybook/addon-essentials includes docs, which requires several other dependencies.
  // We install only the dependencies we need, and the storybook version is different from the one
  // that NX forces.
  const packageJson = readJson(tree, 'package.json');
  const storybookVersion =
    packageJson.devDependencies['@storybook/addon-toolbars'];
  if (storybookVersion) {
    // The `addDependenciesToPackageJson` will not set the right version if the version is lower than the version than what the `storiesGenerator`
    // installs (even if this version uses a caret). Remove the entries first so that the addition will go through with the right version.
    removeDependenciesFromPackageJson(
      tree,
      [],
      ['@storybook/angular', '@storybook/core-server']
    );
    addDependenciesToPackageJson(
      tree,
      {},
      {
        '@storybook/angular': storybookVersion,
        '@storybook/core-server': storybookVersion,
      }
    );
  }
  // Do not add explicit dependencies for @storybook/addon-essentials or webpack.
  removeDependenciesFromPackageJson(
    tree,
    [],
    ['@storybook/addon-essentials', 'html-webpack-plugin', 'webpack']
  );

  // Clean up duplicate entries in nx.json
  updateJson(tree, 'nx.json', (json) => {
    if (
      json.targetDefaults['build-storybook']?.inputs &&
      Array.isArray(json.targetDefaults['build-storybook'].inputs)
    ) {
      // Remove duplicate entries
      json.targetDefaults['build-storybook'].inputs = json.targetDefaults[
        'build-storybook'
      ].inputs.filter(
        (v: string, i: number, a: string[]) => a.indexOf(v) === i
      );
    }
    if (
      json.namedInputs?.production &&
      Array.isArray(json.namedInputs.production)
    ) {
      // Remove duplicate entries
      json.namedInputs.production = json.namedInputs.production.filter(
        (v: string, i: number, a: string[]) => a.indexOf(v) === i
      );
    }
    return json;
  });

  await formatFiles(tree);

  /* istanbul ignore next */
  return () => installPackagesTask(tree);
}
