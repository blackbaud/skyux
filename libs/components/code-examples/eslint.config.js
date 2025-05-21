const angular = require('angular-eslint');
const tsEslint = require('typescript-eslint');
const config = require('../../../eslint-libs.config');
const skyuxPlugin = require('../../sdk/skyux-eslint/dev-transpiler.cjs');
const skyuxConfig = require('../../sdk/eslint-config-skyux/dev-transpiler.cjs');

module.exports = tsEslint.config(
  ...config,
  ...skyuxConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './libs/components/code-examples/tsconfig.json',
      },
    },
  },
  {
    files: ['**/*.ts'],
    extends: [
      // Stylistic rules are not included in our "recommended" config, but we
      // include them to enforce code style in the examples.
      ...tsEslint.configs.stylisticTypeChecked,
      // We want to run all custom rules for our examples, not just the recommended ones.
      ...skyuxPlugin.configs.tsAll,
    ],
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
      '@nx/enforce-module-boundaries': 'warn',
      '@typescript-eslint/no-deprecated': 'warn',
      'no-alert': 'warn',
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      // Template accessibility rules are not included in our "recommended" config,
      // but we include them in the code examples so we can catch any issues.
      ...angular.configs.templateAccessibility,
      // We want to run all custom rules for our examples, not just the recommended ones.
      ...skyuxPlugin.configs.templateAll,
    ],
    rules: {
      'skyux-eslint-template/no-deprecated-directives': 'warn',
    },
  },
);
