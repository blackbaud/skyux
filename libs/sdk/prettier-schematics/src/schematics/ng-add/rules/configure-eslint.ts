import { normalize, workspaces } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';

import { readJsonFile, writeJsonFile } from '../../utility/tree';
import { ESLintConfig } from '../types/eslint-config';

function addPrettierExtendsItem(
  configWithExtends: { extends?: string | string[] },
  alwaysAdd: boolean,
): void {
  if (configWithExtends.extends || alwaysAdd) {
    // Info on how ESLint can extend other configuration files:
    // https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files
    if (typeof configWithExtends.extends === 'string') {
      configWithExtends.extends = [configWithExtends.extends];
    }

    configWithExtends.extends = configWithExtends.extends || [];
    let indexOfPrettier = configWithExtends.extends.indexOf('prettier');

    // The 'prettier' extends option should always be last in the list.
    // https://github.com/prettier/eslint-config-prettier#installation
    if (
      indexOfPrettier >= 0 &&
      indexOfPrettier < configWithExtends.extends.length - 1
    ) {
      configWithExtends.extends.splice(indexOfPrettier, 1);
      indexOfPrettier = -1;
    }

    if (indexOfPrettier < 0) {
      configWithExtends.extends.push('prettier');
    }
  }
}

function addPrettierExtendsToConfig(
  tree: Tree,
  eslintConfigPath: string,
  eslintConfig: ESLintConfig,
): void {
  // Always add 'prettier' to the top-level extends property.
  addPrettierExtendsItem(eslintConfig, true);

  if (Array.isArray(eslintConfig.overrides)) {
    for (const configOverride of eslintConfig.overrides) {
      // Check each file type override and add 'prettier' to its extends
      // property only if the property is present. If the property is
      // not present, the top-level extends property is sufficient for the
      // file type.
      addPrettierExtendsItem(configOverride, false);
    }
  }

  writeJsonFile(tree, eslintConfigPath, eslintConfig);
}

function processESLintConfig(
  tree: Tree,
  context: SchematicContext,
  projectRoot: string,
  updatedESLintConfigs: string[],
): void {
  const flatConfigPath = normalize(`${projectRoot}/eslint.config.js`);
  const legacyConfigPath = normalize(`${projectRoot}/.eslintrc.json`);
  const hasFlatConfig = tree.exists(flatConfigPath);

  if (hasFlatConfig) {
    const eslintConfig = tree.readText(flatConfigPath);
    const lastClosingParenthesisRegExp = /\)(?!(?:\n|.)*\))/;
    const parenthesisMatch = lastClosingParenthesisRegExp.exec(eslintConfig);

    if (parenthesisMatch) {
      const exportsMatch = /\nmodule\.exports/.exec(eslintConfig);

      if (exportsMatch) {
        const recorder = tree.beginUpdate(flatConfigPath);

        recorder.insertLeft(
          exportsMatch.index,
          'const prettier = require("eslint-config-prettier/flat");\n',
        );

        recorder.insertRight(parenthesisMatch.index, '  ,prettier\n');

        tree.commitUpdate(recorder);
      }
    }

    updatedESLintConfigs.push(flatConfigPath);
  } else if (tree.exists(legacyConfigPath)) {
    const eslintConfig = readJsonFile<ESLintConfig>(tree, legacyConfigPath);

    context.logger.info(`Configuring ${legacyConfigPath}...`);

    addPrettierExtendsToConfig(tree, legacyConfigPath, eslintConfig);
    updatedESLintConfigs.push(legacyConfigPath);
  }
}

export function configureESLint(
  workspace: workspaces.WorkspaceDefinition,
): Rule {
  return (tree, context) => {
    const updatedESLintConfigs: string[] = [];
    context.logger.info('Configuring ESLint Prettier plugin...');

    const projects = workspace.projects.values();
    let project: workspaces.ProjectDefinition | undefined;

    while ((project = projects.next().value)) {
      processESLintConfig(tree, context, project.root, updatedESLintConfigs);
    }

    processESLintConfig(tree, context, '', updatedESLintConfigs);

    if (updatedESLintConfigs.length === 0) {
      throw new SchematicsException(
        `No ESLint configuration file found in workspace. ESLint must be installed and configured before installing Prettier. See https://github.com/angular-eslint/angular-eslint#readme for instructions.`,
      );
    }
  };
}
