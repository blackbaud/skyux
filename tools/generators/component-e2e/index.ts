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
  GeneratorCallback,
  Tree,
  installPackagesTask,
  logger,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

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
    showcaseName: `${options.name}-storybook`,
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

  const tasks: GeneratorCallback[] = [];

  let createProject = false;
  try {
    readProjectConfiguration(tree, options.showcaseName);
    logger.warn(`The project "${options.showcaseName}" already exists.`);
  } catch (e) {
    createProject = true;
    tasks.push(
      await applicationGenerator(tree, {
        name: options.showcaseName,
        e2eTestRunner: E2eTestRunner.Cypress,
        tags: options.tags,
        style: options.style,
        routing: options.routing,
        strict: options.strict,
        prefix: options.prefix,
        unitTestRunner: UnitTestRunner.Jest,
      })
    );
  }

  if (
    createProject ||
    !tree.exists(`apps/${options.showcaseName}/.storybook/main.js`)
  ) {
    tasks.push(
      await storybookConfigurationGenerator(tree, {
        name: options.showcaseName,
        generateStories: true,
        configureCypress: true,
        generateCypressSpecs: true,
        linter: Linter.EsLint,
      })
    );
  } else {
    logger.warn(
      `The project "${options.showcaseName}" is configured for storybook.`
    );
    tasks.push(() =>
      angularStoriesGenerator(tree, {
        name: options.showcaseName,
        generateCypressSpecs: true,
      })
    );
  }

  tasks.push(() => installPackagesTask(tree));
  return runTasksInSerial(...tasks);
}

export default componentE2eGenerator;
