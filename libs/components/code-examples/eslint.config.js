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
      // include them to enforce code style.
      ...tsEslint.configs.stylisticTypeChecked,
      ...skyuxPlugin.configs.tsAll,
    ],
    rules: {
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
      ...skyuxPlugin.configs.templateAll,
    ],
    rules: {
      'skyux-eslint-template/no-deprecated-directives': 'warn',
    },
  },
);
