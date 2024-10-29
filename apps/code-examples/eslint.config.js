// @ts-check
const tsEslint = require('typescript-eslint');
const skyux = require('../../libs/sdk/skyux-eslint/dev-transpiler.cjs');
const config = require('../../eslint-apps.config');

module.exports = tsEslint.config(
  ...config,
  {
    files: ['**/src/app/code-examples/**/*.ts'],
    extends: [...skyux.configs.tsAll],
    rules: {
      '@typescript-eslint/no-deprecated': 'warn',
      'no-alert': 'warn',
      'no-console': 'warn',
    },
  },
  {
    files: ['**/src/app/code-examples/**/*.html'],
    extends: [...skyux.configs.templateAll],
    rules: {
      'skyux-eslint-template/no-deprecated-directives': 'warn',
    },
  },
);
