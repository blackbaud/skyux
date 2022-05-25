import {
  Tree,
  formatFiles,
  generateFiles,
  getProjects,
  getWorkspacePath,
  joinPathFragments,
  logger,
  updateJson,
} from '@nrwl/devkit';
import { TsConfig } from '@nrwl/storybook/src/utils/utilities';

import { relative } from 'path';

import { Schema } from './schema';

export default async function (tree: Tree, schema: Schema) {
  updateJson(tree, getWorkspacePath(tree), (angularJson) => {
    const e2eProjectName = `${schema.name}-e2e`;
    if (e2eProjectName in angularJson.projects) {
      const e2eProject = angularJson.projects[e2eProjectName];
      if (e2eProject.architect.e2e?.builder === '@nrwl/cypress:cypress') {
        const e2eOptions = e2eProject.architect.e2e.options;
        e2eOptions.devServerTarget = `${schema.name}:storybook`;
        e2eOptions.baseUrl = `http://localhost:4400`;
        e2eOptions.headed = true;
        e2eOptions.watch = true;
        delete e2eOptions.configurations;
        e2eProject.architect.e2e.configurations = {
          ci: {
            skipServe: true,
            headed: false,
            watch: false,
          },
        };
      } else {
        logger.fatal(
          `Project "${e2eProjectName}" does not have an e2e target with @nrwl/cypress:cypress`
        );
      }
    } else {
      logger.fatal(`Unable to locate a project named "${e2eProjectName}"`);
    }
    return angularJson;
  });

  const projects = getProjects(tree);
  const projectRoot = projects.get(schema.name).root;
  const relativeToRoot = relative(`/${projectRoot}/.storybook`, `/`);
  const managerTsFile = `${projectRoot}/.storybook/manager.ts`;
  if (!tree.exists(managerTsFile)) {
    tree.write(
      managerTsFile,
      `export * from '${relativeToRoot}/.storybook/manager';`
    );
  }
  if (tree.exists(`${projectRoot}/.storybook/manager.js`)) {
    tree.delete(`${projectRoot}/.storybook/manager.js`);
  }

  const tsconfigFile = `${projectRoot}/.storybook/tsconfig.json`;
  if (!tree.exists(tsconfigFile)) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, `./files/tsconfig`),
      `${projectRoot}/.storybook`,
      {}
    );
  }
  updateJson(tree, tsconfigFile, (tsconfig: TsConfig) => {
    if (!tsconfig.include.includes('./*')) {
      tsconfig.include.push('./*');
    }
    return tsconfig;
  });

  // Use remove default files.
  ['preview', 'main'].forEach((file) => {
    if (tree.exists(`${projectRoot}/.storybook/${file}.js`)) {
      tree.delete(`${projectRoot}/.storybook/${file}.js`);
    }
  });

  // Use typescript.
  if (tree.exists(`${projectRoot}/.storybook/manager.js`)) {
    if (!tree.exists(`${projectRoot}/.storybook/manager.ts`)) {
      tree.rename(
        `${projectRoot}/.storybook/manager.js`,
        `${projectRoot}/.storybook/manager.ts`
      );
    } else {
      tree.delete(`${projectRoot}/.storybook/manager.js`);
    }
  }

  if (!tree.exists(`${projectRoot}/.storybook/preview.ts`)) {
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

  await formatFiles(tree);
}
