import {
  ProjectConfiguration,
  TargetConfiguration,
  Tree,
  formatFiles,
  generateFiles,
  getWorkspacePath,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  updateJson,
} from '@nrwl/devkit';
import { TsConfig } from '@nrwl/storybook/src/utils/utilities';

import { updateProjectConfiguration } from 'nx/src/generators/utils/project-configuration';
import { relative } from 'path';

import { getStorybookProjects } from '../../utils';

import { Schema } from './schema';

/**
 * Configure Storybook to use typescript. Set Storybook to run during e2e in development mode.
 */
export default async function (tree: Tree, schema: Schema) {
  const projects = getStorybookProjects(tree, schema.name);
  const workspacePath = getWorkspacePath(tree);

  // istanbul ignore if
  if (!workspacePath) {
    throw new Error(`Unable to determine workspace file path`);
  }

  // istanbul ignore next
  const errorLogger = schema.ansiColor === false ? console.error : logger.fatal;

  projects.forEach((project, projectName) => {
    let hasChanged = false;
    const targets = Object.keys(
      project.targets as Record<string, TargetConfiguration>
    );
    targets.forEach((target) => {
      project.targets = project.targets as Record<string, TargetConfiguration>;
      const targetConfig = project.targets[target] as TargetConfiguration;
      // Does the builder support styles?
      if (
        [
          '@angular-devkit/build-angular:browser',
          '@storybook/angular:build-storybook',
          '@storybook/angular:start-storybook',
        ].includes(targetConfig.executor)
      ) {
        // Add stylesheets to project.
        if (!targetConfig.options) {
          targetConfig.options = {
            styles: [],
          };
        }
        [
          'libs/components/theme/src/lib/styles/sky.scss',
          'libs/components/theme/src/lib/styles/themes/modern/styles.scss',
        ].forEach((stylesheet) => {
          if (!targetConfig.options.styles?.includes(stylesheet)) {
            hasChanged = true;
            if (targetConfig.options.styles) {
              targetConfig.options.styles.push(stylesheet);
            } else {
              targetConfig.options.styles = [stylesheet];
            }
          }
        });
      }
      // Drop the asset path.
      if (target === 'build' && targetConfig.options.assets) {
        hasChanged = true;
        delete targetConfig.options.assets;
      }
    });
    if (hasChanged) {
      updateProjectConfiguration(tree, projectName, project);
    }

    const e2eProjectName = `${projectName}-e2e`;
    let e2eProject: ProjectConfiguration | undefined = undefined;
    try {
      e2eProject = readProjectConfiguration(tree, e2eProjectName);
    } catch (e) {
      errorLogger(`Project "${e2eProjectName}" does not exist`);
    }
    if (
      e2eProject &&
      e2eProject.targets?.e2e &&
      e2eProject.targets.e2e.executor === '@nrwl/cypress:cypress'
    ) {
      let hasChanged = false;
      if (
        !e2eProject.targets.e2e.options.devServerTarget ||
        !e2eProject.targets.e2e.options.baseUrl
      ) {
        hasChanged = true;
        // During development, run Storybook and Cypress.
        e2eProject.targets.e2e.options = {
          ...e2eProject.targets.e2e.options,
          devServerTarget: `${projectName}:storybook`,
          baseUrl: `http://localhost:4400`,
        };
      }
      if (hasChanged) {
        updateProjectConfiguration(tree, e2eProjectName, e2eProject);
      }
    } else {
      errorLogger(
        `Project "${e2eProjectName}" does not have an e2e target with @nrwl/cypress:cypress`
      );
    }

    const projectRoot = project.root;
    const relativeToRoot = relative(`/${projectRoot}/.storybook`, `/`);

    const tsconfigFile = `${projectRoot}/.storybook/tsconfig.json`;
    const tsconfigAppFile = `${projectRoot}/tsconfig.app.json`;
    if (!tree.isFile(tsconfigFile)) {
      tree.write(
        `${projectRoot}/.storybook/tsconfig.json`,
        JSON.stringify({
          extends: '../tsconfig.json',
          // This is needed to address a bug with dependency injection when using Storybook.
          // See: https://stackoverflow.com/a/57115788/6178885
          compilerOptions: {
            emitDecoratorMetadata: true,
          },
          exclude: ['../**/*.spec.ts', 'jest.config.ts'],
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
      if (tsconfig.exclude && !tsconfig.exclude.includes('jest.config.ts')) {
        tsconfig.exclude.push('jest.config.ts');
      }
      return tsconfig;
    });
    if (tree.isFile(tsconfigAppFile)) {
      updateJson(tree, tsconfigAppFile, (tsconfig: TsConfig) => {
        if (tsconfig.exclude && !tsconfig.exclude.includes('jest.config.ts')) {
          tsconfig.exclude.push('jest.config.ts');
        }
        return tsconfig;
      });
    }

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
