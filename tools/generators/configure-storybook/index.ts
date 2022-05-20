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
    if (
      !tsconfig.exclude.includes(
        `${relativeToRoot}/libs/components/*/src/**/*.spec.ts`
      )
    ) {
      tsconfig.exclude.push(
        `${relativeToRoot}/libs/components/*/src/**/*.spec.ts`
      );
    }
    if (tsconfig.include.includes('*.js')) {
      tsconfig.include.splice(tsconfig.include.indexOf('*.js'), 1);
    }
    if (!tsconfig.include.includes('./*')) {
      tsconfig.include.push('./*');
    }
    if (
      !tsconfig.include.includes(`${relativeToRoot}/libs/components/*/src/**/*`)
    ) {
      tsconfig.include.push(`${relativeToRoot}/libs/components/*/src/**/*`);
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
