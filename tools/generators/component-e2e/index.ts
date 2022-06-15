import { SchematicsAngularApplicationStyle } from '@angular/cli/lib/config/workspace-schema';
import {
  angularStoriesGenerator,
  applicationGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import {
  E2eTestRunner,
  UnitTestRunner,
} from '@nrwl/angular/src/utils/test-runners';
import {
  Tree,
  formatFiles,
  getWorkspacePath,
  logger,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import { updateJson } from '../../utils/update-json';
import configurePercy from '../configure-percy';
import configureStorybook from '../configure-storybook';

import { NormalizedSchema, Schema } from './schema';

function normalizeOptions(
  host: Tree,
  options: Partial<Schema>
): NormalizedSchema {
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
  };
}

export async function componentE2eGenerator(
  tree: Tree,
  schema: Partial<Schema>
) {
  const options = normalizeOptions(tree, schema);

  let createProject = false;
  let appGenerator: () => void;
  try {
    readProjectConfiguration(tree, options.storybookAppName);
    logger.warn(`The project "${options.storybookAppName}" already exists.`);
  } catch (e) {
    createProject = true;
    appGenerator = await applicationGenerator(tree, {
      name: options.storybookAppName,
      e2eTestRunner: E2eTestRunner.Cypress,
      tags: options.tags,
      style: options.style,
      routing: options.routing,
      strict: options.strict,
      prefix: options.prefix,
      unitTestRunner: UnitTestRunner.Jest,
    });
    updateJson(tree, getWorkspacePath(tree), (angularJson) => {
      angularJson.projects[
        options.storybookAppName
      ].architect.build.options.styles.push(
        'libs/components/theme/src/lib/styles/sky.scss',
        'libs/components/theme/src/lib/styles/themes/modern/styles.scss'
      );
      return angularJson;
    });
  }

  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let storybookGenerator = () => {};
  if (
    createProject ||
    !(
      tree.isFile(`apps/${options.storybookAppName}/.storybook/main.js`) ||
      tree.isFile(`apps/${options.storybookAppName}/.storybook/main.ts`)
    )
  ) {
    storybookGenerator = await storybookConfigurationGenerator(tree, {
      name: options.storybookAppName,
      generateStories: true,
      configureCypress: true,
      generateCypressSpecs: true,
      linter: Linter.EsLint,
    });
  } else {
    angularStoriesGenerator(tree, {
      name: options.storybookAppName,
      generateCypressSpecs: true,
    });
  }
  await configureStorybook(tree, { name: options.storybookAppName });
  await configurePercy(tree, { name: `${options.storybookAppName}-e2e` });
  /* istanbul ignore next */
  return runTasksInSerial(appGenerator, storybookGenerator, () =>
    formatFiles(tree)
  );
}

export default componentE2eGenerator;
