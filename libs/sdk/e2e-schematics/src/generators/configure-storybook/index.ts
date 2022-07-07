import {
  Tree,
  formatFiles,
  generateFiles,
  getWorkspacePath,
  joinPathFragments,
  logger,
  updateJson,
} from '@nrwl/devkit';
import { TsConfig } from '@nrwl/storybook/src/utils/utilities';

import { relative } from 'path';

import { getStorybookProjects } from '../../utils';

import { Schema } from './schema';

/**
 * Configure Storybook to use typescript. Set Storybook to run during e2e in development mode.
 */
export default async function (tree: Tree, schema: Schema) {
  const projects = getStorybookProjects(tree, schema.name);
  const workspacePath = getWorkspacePath(tree);
  projects.forEach((project, projectName) => {
    updateJson(tree, workspacePath, (angularJson) => {
      const targets = Object.keys(angularJson.projects[projectName].architect);
      targets.forEach((target) => {
        // Does the builder support styles?
        if (
          [
            '@angular-devkit/build-angular:browser',
            '@storybook/angular:build-storybook',
            '@storybook/angular:start-storybook',
          ].includes(
            angularJson.projects[projectName].architect[target].builder
          )
        ) {
          // Add stylesheets to project.
          if (!angularJson.projects[projectName].architect[target].options) {
            angularJson.projects[projectName].architect[target].options = {
              styles: [],
            };
          }
          [
            'libs/components/theme/src/lib/styles/sky.scss',
            'libs/components/theme/src/lib/styles/themes/modern/styles.scss',
          ].forEach((stylesheet) => {
            if (
              !angularJson.projects[projectName].architect[
                target
              ].options.styles?.includes(stylesheet)
            ) {
              if (
                angularJson.projects[projectName].architect[target].options
                  .styles
              ) {
                angularJson.projects[projectName].architect[
                  target
                ].options.styles.push(stylesheet);
              } else {
                angularJson.projects[projectName].architect[
                  target
                ].options.styles = [stylesheet];
              }
            }
          });
        }
      });
      // Drop the asset path.
      if (angularJson.projects[projectName].architect.build?.options?.assets) {
        delete angularJson.projects[projectName].architect.build.options.assets;
      }

      const e2eProjectName = `${projectName}-e2e`;
      if (e2eProjectName in angularJson.projects) {
        const e2eProject = angularJson.projects[e2eProjectName];
        if (e2eProject.architect.e2e?.builder === '@nrwl/cypress:cypress') {
          // During development, run Storybook and Cypress.
          const e2eOptions = e2eProject.architect.e2e.options;
          e2eOptions.devServerTarget = `${projectName}:storybook`;
          e2eOptions.baseUrl = `http://localhost:4400`;
          e2eProject.architect.e2e.configurations = {
            ci: {
              skipServe: true,
            },
          };
        } else {
          (schema.ansiColor === false ? console.error : logger.fatal)(
            `Project "${e2eProjectName}" does not have an e2e target with @nrwl/cypress:cypress`
          );
        }
      }
      return angularJson;
    });

    const projectRoot = project.root;
    const relativeToRoot = relative(`/${projectRoot}/.storybook`, `/`);

    const tsconfigFile = `${projectRoot}/.storybook/tsconfig.json`;
    if (!tree.isFile(tsconfigFile)) {
      tree.write(
        `${projectRoot}/.storybook/tsconfig.json`,
        JSON.stringify({
          extends: '../tsconfig.json',
          compilerOptions: {
            emitDecoratorMetadata: true,
          },
          exclude: ['../**/*.spec.ts'],
          include: ['../src/**/*', './*'],
        })
      );
    }
    updateJson(tree, tsconfigFile, (tsconfig: TsConfig) => {
      if (!tsconfig.include) {
        tsconfig.include = [];
      }
      if (!tsconfig.include.includes('./*')) {
        tsconfig.include.push('./*');
      }
      return tsconfig;
    });

    // Remove default files.
    ['preview', 'main'].forEach((file) => {
      tree.delete(`${projectRoot}/.storybook/${file}.js`);
    });

    if (!tree.isFile(`${projectRoot}/.storybook/preview.ts`)) {
      generateFiles(
        tree,
        joinPathFragments(__dirname, `./files`),
        `${projectRoot}/.storybook/`,
        {
          ...schema,
          relativeToRoot,
        }
      );
    }

    if (!tree.isFile(`${projectRoot}/.storybook/manager.ts`)) {
      tree.write(
        `${projectRoot}/.storybook/manager.ts`,
        `export * from '${relativeToRoot}/.storybook/manager';`
      );
    }
  });

  await formatFiles(tree);
}
