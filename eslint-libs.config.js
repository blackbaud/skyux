const nx = require('@nx/eslint-plugin');
const prettier = require('eslint-config-prettier');
const baseConfig = require('./eslint-base.config');
const overrides = require('./eslint-overrides-angular.config');

module.exports = [
  ...baseConfig,
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
