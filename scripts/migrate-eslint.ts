import { glob } from 'glob';
import { unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function migrateESLintConfig(): Promise<void> {
  const jsonConfigs = await glob('libs/components/**/.eslintrc.json');

  for (const jsonConfigPath of jsonConfigs) {
    const dirname = path.dirname(jsonConfigPath);

    await unlink(jsonConfigPath);

    await writeFile(
      path.join(dirname, 'eslint.config.cjs'),
      `const nx = require('@nx/eslint-plugin');
const prettier = require('eslint-config-prettier');
const baseConfig = require('../../../eslint-base.config.cjs');
const overrides = require('../../../eslint-overrides.config.cjs');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        { ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'] },
      ],
    },
    languageOptions: { parser: require('jsonc-eslint-parser') },
  },
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'sky',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'sky',
          style: 'kebab-case',
        },
      ],
    },
  },
  ...overrides,
  prettier,
];
`,
    );
  }
}

migrateESLintConfig();
