import { SchematicsAngularApplicationStyle } from '@angular/cli/lib/config/workspace-schema';
import {
  applicationGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import {
  ProjectConfiguration,
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  removeDependenciesFromPackageJson,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import configurePercy from '../configure-percy';
import configureStorybook from '../configure-storybook';
import init from '../init';
import storiesGenerator from '../stories';

import { NormalizedSchema, Schema } from './schema';

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
 * - Generates -storybook and -storybook-e2e projects for a component library if they don't already exist.
 * - Applies configuration to the projects.
 * - Generates stories and tests if there are demonstration components in the -storybook project.
 */
export default async function (tree: Tree, schema: Partial<Schema>) {
  const options = normalizeOptions(schema);

  const initTasks = await init(tree, { ansiColor: schema.ansiColor });

  let createProject = false;
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let appGenerator: () => void = () => {};
  let projectConfig: ProjectConfiguration;
  let e2eProjectConfig: ProjectConfiguration;
  try {
    projectConfig = readProjectConfiguration(tree, options.storybookAppName);
    (schema.ansiColor === false ? console.warn : logger.warn)(
      `The project "${options.storybookAppName}" already exists.`
    );
  } catch (e) {
    createProject = true;
    appGenerator = await applicationGenerator(tree, {
      name: options.storybookAppName,
      tags: options.tags,
      style: options.style,
      routing: options.routing,
      strict: options.strict,
      prefix: options.prefix,
    });
    projectConfig = readProjectConfiguration(tree, options.storybookAppName);
    e2eProjectConfig = readProjectConfiguration(
      tree,
      `${options.storybookAppName}-e2e`
    );

    // Delete boilerplate files from the storybook project.
    let indexFile =
      tree.read(`${projectConfig.sourceRoot}/index.html`, 'utf8') ?? '';
    indexFile = indexFile?.replace(
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
    [
      'fixtures/example.json',
      'integration/app.spec.ts',
      'support/app.po.ts',
    ].forEach((file) => tree.delete(`${e2eProjectConfig.sourceRoot}/${file}`));
    // Create an empty app.
    generateFiles(
      tree,
      joinPathFragments(__dirname, 'files/app'),
      `${projectConfig.sourceRoot}/app`,
      {}
    );
    tree.write(`${e2eProjectConfig.sourceRoot}/integration/.gitkeep`, ``);
  }

  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let storybookGenerator = () => {};
  if (
    createProject ||
    !(
      tree.isFile(`${projectConfig.root}/.storybook/main.js`) ||
      tree.isFile(`${projectConfig.root}/.storybook/main.ts`)
    )
  ) {
    storybookGenerator = await storybookConfigurationGenerator(tree, {
      name: options.storybookAppName,
      generateStories: false,
      configureCypress: true,
      generateCypressSpecs: false,
      linter: Linter.EsLint,
    });
  } else {
    await storiesGenerator(tree, {
      project: options.storybookAppName,
      cypressProject: `${options.storybookAppName}-e2e`,
      generateCypressSpecs: true,
    });
  }
  await configureStorybook(tree, { name: options.storybookAppName });
  await configurePercy(tree, { name: `${options.storybookAppName}-e2e` });

  // Do not add explicit dependencies for ts-node or webpack.
  const updateDependencies = removeDependenciesFromPackageJson(
    tree,
    [],
    ['ts-node', 'webpack']
  );

  /* istanbul ignore next */
  return runTasksInSerial(
    initTasks,
    appGenerator,
    storybookGenerator,
    updateDependencies,
    () => formatFiles(tree)
  );
}
