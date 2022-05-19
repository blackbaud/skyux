import {
  Tree,
  getProjects,
  getWorkspacePath,
  logger,
  updateJson,
} from '@nrwl/devkit';

import { relative } from 'path';

import { Schema } from './schema';

export default async function (tree: Tree, schema: Schema) {
  const globalStylesheet = 'libs/components/theme/src/lib/styles/sky.scss';

  // Add stylesheet to Storybook project configuration
  updateJson(tree, getWorkspacePath(tree), (angularJson) => {
    if (schema.name in angularJson.projects) {
      const project = angularJson.projects[schema.name];
      ['build-storybook', 'storybook'].forEach((storybook) => {
        if (storybook in project.architect) {
          const buildOptions = project.architect[storybook].options;
          buildOptions.styles = buildOptions.styles || [];
          if (!buildOptions.styles.includes(globalStylesheet)) {
            buildOptions.styles.push(globalStylesheet);
          }
          buildOptions.stylePreprocessorOptions =
            buildOptions.stylePreprocessorOptions || {};
          if (!('includePaths' in buildOptions.stylePreprocessorOptions)) {
            buildOptions.stylePreprocessorOptions.includePaths = [];
          }
          if (
            !buildOptions.stylePreprocessorOptions.includePaths.includes('.')
          ) {
            buildOptions.stylePreprocessorOptions.includePaths.push('.');
          }
          project.architect[storybook].options = {
            ...buildOptions,
          };
        }
      });
    } else {
      logger.fatal(`Unable to locate a project named "${schema.name}"`);
    }
    return angularJson;
  });

  const projects = getProjects(tree);
  const projectRoot = projects.get(schema.name).root;
  const relativeToRoot = relative(`/${projectRoot}/.storybook`, `/`);
  const managerJsFile = `${projectRoot}/.storybook/manager.js`;
  if (!tree.exists(managerJsFile)) {
    tree.write(
      managerJsFile,
      `export * from '${relativeToRoot}/.storybook/manager';`
    );
  }
  const previewJsFile = `${projectRoot}/.storybook/preview.js`;
  if (
    !tree.exists(previewJsFile) ||
    tree.read(previewJsFile).toString().trim() === ''
  ) {
    tree.write(
      previewJsFile,
      `export * from '${relativeToRoot}/.storybook/preview';`
    );
  }
}

/*
"stylePreprocessorOptions": {
              "includePaths": ["."]
            }
 */
