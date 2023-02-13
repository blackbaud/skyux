import { storybookConfigurationGenerator } from '@nrwl/angular/generators';
import {
  Tree,
  addDependenciesToPackageJson,
  generateFiles,
  getProjects,
  joinPathFragments,
  logger,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';

import { PackageJson } from 'nx/src/utils/package-json';

import {
  applyTransformersToPath,
  getInsertExportTransformer,
} from '../../utils';
import { updateJson } from '../../utils';
import configureStorybook from '../configure-storybook';

import { Schema } from './schema';

/**
 * Verify that Storybook and dependencies are installed.
 */
export default async function (tree: Tree, options: Schema) {
  const storybookConfig = getProjects(tree).get('storybook');
  if (
    !(storybookConfig && storybookConfig.targets && storybookConfig.sourceRoot)
  ) {
    throw new Error(
      'Storybook project or storybook project information not found'
    );
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
        '@percy/cli': 'latest',
        '@percy/cypress': 'latest',
        '@percy/storybook': 'latest',
        '@storybook/addon-a11y': 'latest',
        cypress: 'latest',
        'jest-preset-angular': 'latest',
        sb: 'latest',
      }
    );

    // Configure storybook composition project
    // nx g @skyux-sdk/e2e-schematics:storybook-configuration storybook
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

    // Generate Storybook decorators that rely on package dependencies.
    generateFiles(
      tree,
      joinPathFragments(__dirname, './files/preview-wrapper'),
      joinPathFragments(storybookConfig.sourceRoot, './lib/preview-wrapper'),
      {}
    );
    applyTransformersToPath(
      tree,
      joinPathFragments(storybookConfig.sourceRoot, 'index.ts'),
      [
        getInsertExportTransformer(
          './lib/preview-wrapper/preview-wrapper-decorators',
          './lib/storybook.module'
        ),
      ]
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
