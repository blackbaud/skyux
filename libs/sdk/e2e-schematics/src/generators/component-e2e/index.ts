import { SchematicsAngularApplicationStyle } from '@angular/cli/lib/config/workspace-schema';
import {
  E2eTestRunner,
  UnitTestRunner,
  applicationGenerator,
} from '@nx/angular/generators';
import {
  ProjectConfiguration,
  Tree,
  generateFiles,
  getProjects,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  updateJson,
  updateProjectConfiguration,
} from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { configurationGenerator as storybookConfigurationGenerator } from '@nx/storybook';
import { moveGenerator } from '@nx/workspace';

import { formatFiles } from '../../utils/format-files';
import configurePercy from '../configure-percy';
import configureStorybook from '../configure-storybook';

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
    includeTests: options.includeTests,
  };
}

/**
 * Drop the BASE_PATH from the project name and re-sort the projects.
 */
function simplifyWorkspaceName(tree: Tree, projectName: string): void {
  const projects = getProjects(tree);
  projects.forEach((projectConfig) => {
    let projectConfigJson = JSON.stringify(projectConfig).replace(
      new RegExp(`${BASE_PATH}-${projectName}`, 'g'),
      projectName,
    );
    if (projectName.endsWith('-e2e')) {
      const withoutE2e = projectName.replace(/-e2e$/, '');
      projectConfigJson = projectConfigJson.replace(
        new RegExp(`${BASE_PATH}-${withoutE2e}`, 'g'),
        withoutE2e,
      );
    }
    updateProjectConfiguration(
      tree,
      `${BASE_PATH}-${projectName}`,
      JSON.parse(projectConfigJson),
    );
  });
}

/**
 * Add the packages polyfills to the build and test targets.
 */
function addPackagesPolyfills(tree: Tree, projectName: string): void {
  const polyfillsBuilders = [
    '@angular-devkit/build-angular:application',
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
        projectConfig.targets?.[target] &&
        polyfillsBuilders.includes(
          `${projectConfig.targets?.[target].executor}`,
        )
      ) {
        const targetOptions = projectConfig.targets[target].options;

        targetOptions.polyfills ??= [];

        if (Array.isArray(targetOptions.polyfills)) {
          targetOptions.polyfills.push(
            'libs/components/packages/src/polyfills.js',
          );
          hasChanged = true;
        }
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
export default async function (
  tree: Tree,
  schema: Partial<Schema>,
): Promise<void> {
  const initialNxJson = tree.read('nx.json', 'utf-8');
  const initialPackageJson = tree.read('package.json', 'utf-8');
  const options = normalizeOptions(schema);

  let createProject = false;
  let moveProject = false;
  /* istanbul ignore next */
  let projectConfig: ProjectConfiguration;
  let e2eProjectConfig: ProjectConfiguration;
  try {
    projectConfig = readProjectConfiguration(tree, options.storybookAppName);
    if (projectConfig.targets?.['test'] && !options.includeTests) {
      delete projectConfig.targets['test'];
      updateProjectConfiguration(tree, options.storybookAppName, projectConfig);
    }
    if (projectConfig.root === `apps/${options.storybookAppName}`) {
      moveProject = true;
      await moveGenerator(tree, {
        projectName: options.storybookAppName,
        destination: `apps/${BASE_PATH}/${options.storybookAppName}`,
        updateImportPath: false,
        skipFormat: true,
      });
      simplifyWorkspaceName(tree, options.storybookAppName);
      projectConfig = readProjectConfiguration(tree, options.storybookAppName);
    }
    e2eProjectConfig = readProjectConfiguration(
      tree,
      `${options.storybookAppName}-e2e`,
    );
    if (e2eProjectConfig.root === `apps/${options.storybookAppName}-e2e`) {
      moveProject = true;
      await moveGenerator(tree, {
        projectName: `${options.storybookAppName}-e2e`,
        destination: `apps/${BASE_PATH}/${options.storybookAppName}-e2e`,
        updateImportPath: false,
        skipFormat: true,
      });
      simplifyWorkspaceName(tree, `${options.storybookAppName}-e2e`);
      e2eProjectConfig = readProjectConfiguration(
        tree,
        `${options.storybookAppName}-e2e`,
      );
    }
    if (!moveProject) {
      (schema.ansiColor === false ? console.warn : logger.warn)(
        `The project "${options.storybookAppName}" already exists.`,
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
      directory: `apps/${BASE_PATH}/${options.storybookAppName}`,
      skipPackageJson: true,
      skipTests: !options.includeTests,
      skipFormat: true,
      standalone: false,
      bundler: 'webpack',
      unitTestRunner: UnitTestRunner.None,
      e2eTestRunner: E2eTestRunner.Cypress,
    });
    simplifyWorkspaceName(tree, options.storybookAppName);
    simplifyWorkspaceName(tree, `${options.storybookAppName}-e2e`);
    addPackagesPolyfills(tree, options.storybookAppName);
    projectConfig = readProjectConfiguration(tree, options.storybookAppName);
    e2eProjectConfig = readProjectConfiguration(
      tree,
      `${options.storybookAppName}-e2e`,
    );

    // Delete boilerplate files from the storybook project.
    let indexFile = tree.read(`${projectConfig.sourceRoot}/index.html`, 'utf8');

    // istanbul ignore if
    if (!indexFile) {
      indexFile = '';
    }

    indexFile = indexFile.replace(
      '<link rel="icon" type="image/x-icon" href="favicon.ico" />',
      '',
    );
    tree.write(`${projectConfig.sourceRoot}/index.html`, indexFile);
    [
      'favicon.ico',
      'assets/.gitkeep',
      'app/app.module.ts',
      'app/app.routes.ts',
      'app/app.component.scss',
      'app/app.component.html',
      'app/app.component.spec.ts',
      'app/app.component.ts',
      'app/nx-welcome.component.ts',
    ].forEach((file) => tree.delete(`${projectConfig.sourceRoot}/${file}`));
    ['e2e/app.cy.ts', 'fixtures/example.json', 'support/app.po.ts'].forEach(
      (file) => tree.delete(`${e2eProjectConfig.sourceRoot}/${file}`),
    );
    // Create an empty app.
    generateFiles(
      tree,
      joinPathFragments(__dirname, 'files/app'),
      `${projectConfig.sourceRoot}/app`,
      {},
    );
    tree.write(`${e2eProjectConfig.sourceRoot}/e2e/.gitkeep`, ``);
  }

  /* istanbul ignore next */
  if (
    createProject ||
    !(
      tree.isFile(`${projectConfig.root}/.storybook/main.js`) ||
      tree.isFile(`${projectConfig.root}/.storybook/main.ts`)
    )
  ) {
    await storybookConfigurationGenerator(tree, {
      project: options.storybookAppName,
      uiFramework: '@storybook/angular',
      interactionTests: false,
      linter: Linter.EsLint,
      configureStaticServe: true,
      skipFormat: true,
    });
  }
  if (!moveProject) {
    await configureStorybook(tree, {
      name: options.storybookAppName,
      skipFormat: true,
    });
    await configurePercy(tree, {
      name: `${options.storybookAppName}-e2e`,
      skipFormat: true,
    });
  }

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
        (v: string, i: number, a: string[]) => a.indexOf(v) === i,
      );
    }
    if (
      json.namedInputs?.production &&
      Array.isArray(json.namedInputs.production)
    ) {
      // Remove duplicate entries
      json.namedInputs.production = json.namedInputs.production.filter(
        (v: string, i: number, a: string[]) => a.indexOf(v) === i,
      );
    }
    return json;
  });

  // Adding a project should not make changes to the nx.json or package.json files.
  tree.write('nx.json', `${initialNxJson}`);
  tree.write('package.json', `${initialPackageJson}`);

  await formatFiles(tree, { skipFormat: schema.skipFormat });
}
