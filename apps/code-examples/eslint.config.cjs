const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const nx = require('@nx/eslint-plugin');
const prettier = require('eslint-config-prettier');
const path = require('node:path');
const baseConfig = require('../../eslint-base.config.cjs');
const overrides = require('../../eslint-overrides-angular.config.cjs');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

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
  ...compat
    .config({
      extends: ['../../libs/sdk/eslint-config/recommended'],
    })
    .map((config) => ({
      files: ['**/code-examples/**/*.ts'],
      languageOptions: {
        ...config.languageOptions,
        parserOptions: {
          project: [path.join(__dirname, 'tsconfig.editor.json')],
          tsconfigRootDir: '.',
        },
      },
      linterOptions: { reportUnusedDisableDirectives: true },
      rules: {
        ...config.rules,
        'no-alert': 'warn',
        'no-console': 'warn',
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['../*'],
                message: 'Make sure to import from local files only.',
              },
            ],
          },
        ],
      },
    })),
  prettier,
];
