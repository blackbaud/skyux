import { glob } from 'glob';
import { unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const NODE_ESLINT = `const prettier = require('eslint-config-prettier');
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
  ...overrides,
  prettier,
];
`;

const ANGULAR_ESLINT = `const nx = require('@nx/eslint-plugin');
const prettier = require('eslint-config-prettier');
const baseConfig = require('../../../eslint-base.config.cjs');
const overrides = require('../../../eslint-overrides-angular.config.cjs');

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
  ...overrides,
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts', '**/fixtures/**'],
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
  prettier,
];
`;

const ANGULAR_DEPRECATED_ESLINT = `const nx = require('@nx/eslint-plugin');
const prettier = require('eslint-config-prettier');
const baseConfig = require('../../../eslint-base.config.cjs');
const overrides = require('../../../eslint-overrides-angular.config.cjs');

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
  ...overrides,
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts', '**/fixtures/**'],
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
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/prefer-control-flow': ['warn'],
    },
  },
  prettier,
];
`;

async function migrateComponentsESLintConfig(): Promise<void> {
  const jsonConfigs = await glob('libs/components/**/.eslintrc.json');

  for (const jsonConfigPath of jsonConfigs) {
    const dirname = path.dirname(jsonConfigPath);

    await unlink(jsonConfigPath);

    let contents: string | undefined;

    if (/\/(list-builder|grid|select-field)/.test(dirname)) {
      contents = ANGULAR_DEPRECATED_ESLINT;
    } else if (/\/(packages)\//.test(dirname)) {
      contents = NODE_ESLINT;
    } else {
      contents = ANGULAR_ESLINT;
    }

    if (contents) {
      await writeFile(path.join(dirname, 'eslint.config.cjs'), contents);
    }
  }
}

async function migrateSdkESLintConfig(): Promise<void> {
  const jsonConfigs = await glob('libs/sdk/**/.eslintrc.json');

  for (const jsonConfigPath of jsonConfigs) {
    const dirname = path.dirname(jsonConfigPath);

    await unlink(jsonConfigPath);

    let contents: string | undefined;

    if (/\/(list-builder|grid|select-field)/.test(dirname)) {
      contents = ANGULAR_DEPRECATED_ESLINT;
    } else if (/\/(packages)\//.test(dirname)) {
      contents = NODE_ESLINT;
    } else {
      contents = ANGULAR_ESLINT;
    }

    if (contents) {
      await writeFile(path.join(dirname, 'eslint.config.cjs'), contents);
    }
  }
}

migrateComponentsESLintConfig();
migrateSdkESLintConfig();
