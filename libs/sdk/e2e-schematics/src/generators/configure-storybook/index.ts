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

import * as assert from 'assert';
import { relative } from 'path';

import { someOrAllStorybookProjects } from '../../utils/some-or-all-projects';

import { Schema } from './schema';

export async function configureStorybook(tree: Tree, schema: Schema) {
  const projects = someOrAllStorybookProjects(tree, schema.name);
  const workspacePath = getWorkspacePath(tree);
  assert.ok(workspacePath);
  projects.forEach((project, projectName) => {
    updateJson(tree, workspacePath, (angularJson) => {
      const e2eProjectName = `${projectName}-e2e`;
      if (e2eProjectName in angularJson.projects) {
        const e2eProject = angularJson.projects[e2eProjectName];
        if (e2eProject.architect.e2e?.builder === '@nrwl/cypress:cypress') {
          const e2eOptions = e2eProject.architect.e2e.options;
          e2eOptions.devServerTarget = `${projectName}:storybook`;
          e2eOptions.baseUrl = `http://localhost:4400`;
          e2eProject.architect.e2e.configurations = {
            ci: {
              skipServe: true,
            },
          };
        } else {
          logger.fatal(
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
  });

  await formatFiles(tree);
}

export default configureStorybook;
