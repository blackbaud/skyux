import { glob } from 'glob';
import { unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ESLINT_APPS = `const nx = require('@nx/eslint-plugin');
const prettier = require('eslint-config-prettier');
const baseConfig = require('../../eslint-base.config.cjs');
const overrides = require('../../eslint-overrides-angular.config.cjs');

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
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  prettier,
];
`;

const ESLINT_STORYBOOK_APPS = `const nx = require('@nx/eslint-plugin');
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
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  prettier,
];
`;

const ESLINT_E2E_APPS = `const prettier = require('eslint-config-prettier');
const cypress = require('eslint-plugin-cypress/flat');
const baseConfig = require('../../../eslint.config.cjs');
const overrides = require('../../../eslint-overrides.config.cjs');

module.exports = [
  cypress.configs['recommended'],
  ...baseConfig,
  ...overrides,
  prettier,
];
`;

const ESLINT_NODE = `const prettier = require('eslint-config-prettier');
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

const ESLINT_ANGULAR = `const nx = require('@nx/eslint-plugin');
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

const ESLINT_ANGULAR_DEPRECATED = `const nx = require('@nx/eslint-plugin');
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
      contents = ESLINT_ANGULAR_DEPRECATED;
    } else if (/\/(packages)\//.test(dirname)) {
      contents = ESLINT_NODE;
    } else {
      contents = ESLINT_ANGULAR;
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
    await writeFile(path.join(dirname, 'eslint.config.cjs'), ESLINT_NODE);
  }
}

async function migrateAppESLintConfig(): Promise<void> {
  const jsonConfigs = await glob(
    'apps/{code-examples,integration,playground}/**/.eslintrc.json',
  );

  for (const jsonConfigPath of jsonConfigs) {
    const dirname = path.dirname(jsonConfigPath);

    await unlink(jsonConfigPath);
    await writeFile(path.join(dirname, 'eslint.config.cjs'), ESLINT_APPS);
  }
}

async function migrateE2EAppESLintConfig(): Promise<void> {
  const jsonConfigs = await glob('apps/e2e/*-e2e/**/.eslintrc.json');

  for (const jsonConfigPath of jsonConfigs) {
    const dirname = path.dirname(jsonConfigPath);

    await unlink(jsonConfigPath);
    await writeFile(path.join(dirname, 'eslint.config.cjs'), ESLINT_E2E_APPS);
  }
}

async function migrateStorybookAppESLintConfig(): Promise<void> {
  const jsonConfigs = await glob('apps/e2e/*-storybook/**/.eslintrc.json');

  for (const jsonConfigPath of jsonConfigs) {
    const dirname = path.dirname(jsonConfigPath);

    await unlink(jsonConfigPath);
    await writeFile(
      path.join(dirname, 'eslint.config.cjs'),
      ESLINT_STORYBOOK_APPS,
    );
  }
}

migrateComponentsESLintConfig();
migrateSdkESLintConfig();
migrateAppESLintConfig();
migrateE2EAppESLintConfig();
migrateStorybookAppESLintConfig();
