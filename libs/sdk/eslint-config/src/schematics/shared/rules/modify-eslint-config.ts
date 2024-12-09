import { Rule } from '@angular-devkit/schematics';

import { EsLintConfig } from '../types/eslint-config';
import { readJsonFile, writeJsonFile } from '../utility/tree';

const ESLINT_CONFIG_NAME = '@skyux-sdk/eslint-config/recommended';
const ESLINT_CONFIG_PATH = '.eslintrc.json';

export function modifyEsLintConfig(): Rule {
  return (tree) => {
    const esLintConfig = readJsonFile<EsLintConfig>(tree, ESLINT_CONFIG_PATH);

    if (Array.isArray(esLintConfig.overrides)) {
      // Overwrite the 'extends' array with our configuration.
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

    writeJsonFile(tree, ESLINT_CONFIG_PATH, esLintConfig);
  };
}
