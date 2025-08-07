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

function needsComma(contents: string): boolean {
  const len = contents.length;

  for (let i = len; i > -1; i--) {
    // Starting at the end of the string, find the first non-whitespace character
    // and check if it's a comma. If it is, we don't need to insert one.
    const maybeComma = contents.at(i);
    if (maybeComma !== undefined && maybeComma.match(/[^\s]/)) {
      return maybeComma !== ',';
    }
  }

  /* istanbul ignore next: safety check */
  return true;
}

function modifyFlatConfigFile(args: {
  eslintConfigFile: string;
  isEsm: boolean;
  tree: Tree;
}): void {
  const { tree, eslintConfigFile, isEsm } = args;
  const eslintConfig = tree.readText(eslintConfigFile);
  const lastClosingParenthesisRegExp = /\)(?!(?:\n|.)*\))/;
  const parenthesisMatch = lastClosingParenthesisRegExp.exec(eslintConfig);
  const exportsRegexp = isEsm ? /\nexport default / : /\nmodule\.exports/;

  if (parenthesisMatch) {
    const exportsMatch = exportsRegexp.exec(eslintConfig);

    if (exportsMatch) {
      const recorder = tree.beginUpdate(eslintConfigFile);
      const importStatement = isEsm
        ? 'import prettier from "eslint-config-prettier";\n'
        : 'const prettier = require("eslint-config-prettier/flat");\n';

      if (eslintConfig.includes(importStatement)) {
        return;
      }

      recorder.insertLeft(exportsMatch.index, importStatement);

      recorder.insertRight(
        parenthesisMatch.index,
        `  ${needsComma(eslintConfig.substring(0, parenthesisMatch.index)) ? ',' : ''}prettier\n`,
      );

      tree.commitUpdate(recorder);
    }
  }
}

function processESLintConfig(
  tree: Tree,
  context: SchematicContext,
  projectRoot: string,
  updatedESLintConfigs: string[],
): void {
  const eslintConfigPath = normalize(`${projectRoot}/.eslintrc.json`);

  if (tree.exists(eslintConfigPath)) {
    const eslintConfig = readJsonFile<ESLintConfig>(tree, eslintConfigPath);

    context.logger.info(`Configuring ${eslintConfigPath}...`);

    addPrettierExtendsToConfig(tree, eslintConfigPath, eslintConfig);
    updatedESLintConfigs.push(eslintConfigPath);
  }
}

export function configureESLint(args: {
  eslintConfigFile?: string;
  isFlatConfig: boolean;
  isEsm: boolean;
  workspace: workspaces.WorkspaceDefinition;
}): Rule {
  return (tree, context) => {
    const { eslintConfigFile, isFlatConfig, isEsm, workspace } = args;
    const updatedESLintConfigs: string[] = [];

    context.logger.info('Configuring ESLint Prettier plugin...');

    if (eslintConfigFile && isFlatConfig) {
      modifyFlatConfigFile({ tree, eslintConfigFile, isEsm });
      updatedESLintConfigs.push(eslintConfigFile);
    } else {
      const projects = workspace.projects.values();
      let project: workspaces.ProjectDefinition | undefined;

      while ((project = projects.next().value)) {
        processESLintConfig(tree, context, project.root, updatedESLintConfigs);
      }

      processESLintConfig(tree, context, '', updatedESLintConfigs);
    }

    if (updatedESLintConfigs.length === 0) {
      throw new SchematicsException(
        `No ESLint configuration file found in workspace. ESLint must be installed and configured before installing Prettier. See https://github.com/angular-eslint/angular-eslint#readme for instructions.`,
      );
    }
  };
}
