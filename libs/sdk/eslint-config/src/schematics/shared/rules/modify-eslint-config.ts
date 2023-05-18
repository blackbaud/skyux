import { Rule } from '@angular-devkit/schematics';

import { EsLintConfig } from '../types/eslint-config';
import { readRequiredFile } from '../utility/tree';

const ESLINT_CONFIG_NAME = '@skyux-sdk/eslint-config/recommended';

export function modifyEsLintConfig(): Rule {
  return async (tree) => {
    const esLintConfig = JSON.parse(
      readRequiredFile(tree, '.eslintrc.json')
    ) as EsLintConfig;

    esLintConfig.parser = '@typescript-eslint/parser';

    esLintConfig.parserOptions = {
      project: ['tsconfig.json'],
      tsconfigRootDir: '.',
    };

    if (Array.isArray(esLintConfig.overrides)) {
      for (const override of esLintConfig.overrides) {
        if (override.files.find((f) => f.endsWith('.ts'))) {
          const hasPrettier = override.extends?.includes('prettier');
          override.extends = [ESLINT_CONFIG_NAME];

          if (hasPrettier) {
            override.extends.push('prettier');
          }
        }
      }
    }
  };
}
