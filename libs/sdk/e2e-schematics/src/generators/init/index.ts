import { storybookConfigurationGenerator } from '@nrwl/angular/generators';
import {
  Tree,
  addDependenciesToPackageJson,
  getProjects,
  logger,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import { PackageJson } from 'nx/src/utils/package-json';

import { updateJson } from '../../utils/update-json';
import configureStorybook from '../configure-storybook';

import { Schema } from './schema';

/**
 * Verify that Storybook and dependencies are installed.
 */
export default async function (tree: Tree, options: Schema) {
  const storybookConfig = getProjects(tree).get('storybook');
  if (!storybookConfig) {
    throw new Error('Storybook project not found');
  }
  if (!storybookConfig.targets.storybook) {
    // nx g @nrwl/angular:storybook-configuration storybook --no-configureCypress --no-generateStories --no-generateCypressSpecs
    const storybookInstall = await storybookConfigurationGenerator(tree, {
      name: 'storybook',
      generateStories: false,
      generateCypressSpecs: false,
      configureCypress: false,
      linter: Linter.EsLint,
    });

    // Additional dependencies
    const dependenciesInstall = await addDependenciesToPackageJson(
      tree,
      {},
      {
        '@percy/cli': '*',
        '@percy/cypress': '*',
        '@percy/storybook': '*',
        '@storybook/addon-a11y': '*',
        cypress: '*',
        'jest-preset-angular': '*',
        sb: '*',
        'storybook-addon-angular-router': '*',
      }
    );

    // Configure storybook composition project
    // nx g @skyux/e2e-schematics:storybook-configuration storybook
    await configureStorybook(tree, { name: 'storybook' });

    updateJson<PackageJson & { percy?: unknown }>(
      tree,
      'package.json',
      (json) => {
        if (!json.percy) {
          json.percy = {
            version: 2,
            snapshot: {
              widths: [375, 1280],
            },
          };
        }
        return json;
      }
    );

    return runTasksInSerial(storybookInstall, dependenciesInstall);
  } else {
    return Promise.resolve(() => {
      (options.ansiColor === false ? console.log : logger.info)(
        'Storybook already initialized'
      );
    });
  }
}
