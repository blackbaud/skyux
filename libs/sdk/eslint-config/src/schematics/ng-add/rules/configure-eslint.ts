import { normalize, workspaces } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';

import { EsLintConfig } from '../../shared/types/eslint-config';
import { readJsonFile, writeJsonFile } from '../../shared/utility/tree';

const ESLINT_CONFIG_NAME = '@skyux-sdk/eslint-config/recommended';

// function addPrettierExtendsItem(
//   configWithExtends: { extends?: string | string[] },
//   alwaysAdd: boolean
// ): void {
//   if (configWithExtends.extends || alwaysAdd) {
//     // Info on how EsLint can extend other configuration files:
//     // https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files
//     if (typeof configWithExtends.extends === 'string') {
//       configWithExtends.extends = [configWithExtends.extends];
//     }

//     configWithExtends.extends = configWithExtends.extends || [];
//     let indexOfPrettier = configWithExtends.extends.indexOf('prettier');

//     // The 'prettier' extends option should always be last in the list.
//     // https://github.com/prettier/eslint-config-prettier#installation
//     if (
//       indexOfPrettier >= 0 &&
//       indexOfPrettier < configWithExtends.extends.length - 1
//     ) {
//       configWithExtends.extends.splice(indexOfPrettier, 1);
//       indexOfPrettier = -1;
//     }

//     if (indexOfPrettier < 0) {
//       configWithExtends.extends.push('prettier');
//     }
//   }
// }

function modifyConfig(
  tree: Tree,
  eslintConfigPath: string,
  eslintConfig: EsLintConfig
): void {
  if (Array.isArray(eslintConfig.overrides)) {
    eslintConfig.parser = '@typescript-eslint/parser';
    eslintConfig.parserOptions = {
      project: ['tsconfig.json'],
      tsconfigRootDir: '.',
    };

    for (const configOverride of eslintConfig.overrides) {
      if (configOverride.files.find((f) => f.endsWith('.ts'))) {
        const hasPrettier = configOverride.extends?.includes('prettier');
        configOverride.extends = [ESLINT_CONFIG_NAME];

        if (hasPrettier) {
          configOverride.extends.push('prettier');
        }
      }
    }
  }

  writeJsonFile(tree, eslintConfigPath, eslintConfig);
}

function processEsLintConfig(
  tree: Tree,
  context: SchematicContext,
  eslintConfigPath: string,
  updatedEsLintConfigs: string[]
): void {
  if (tree.exists(eslintConfigPath)) {
    const eslintConfig = readJsonFile<EsLintConfig>(tree, eslintConfigPath);

    context.logger.info(`Configuring ${eslintConfigPath}...`);

    modifyConfig(tree, eslintConfigPath, eslintConfig);

    updatedEsLintConfigs.push(eslintConfigPath);
  }
}

export function configureEsLint(
  workspace: workspaces.WorkspaceDefinition
): Rule {
  return (tree, context) => {
    const fileName = '.eslintrc.json';
    const updatedEsLintConfigs: string[] = [];

    context.logger.info('Configuring EsLint Prettier plugin...');

    const projects = workspace.projects.values();
    let project: workspaces.ProjectDefinition;

    while ((project = projects.next().value)) {
      processEsLintConfig(
        tree,
        context,
        normalize(`${project.root}/${fileName}`),
        updatedEsLintConfigs
      );
    }

    processEsLintConfig(tree, context, fileName, updatedEsLintConfigs);

    if (updatedEsLintConfigs.length === 0) {
      throw new SchematicsException(
        `No ${fileName} file found in workspace. EsLint must be installed and configured before installing Prettier. See https://github.com/angular-eslint/angular-eslint#readme for instructions.`
      );
    }
  };
}
