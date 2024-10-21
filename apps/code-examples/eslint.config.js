// @ts-check
const tsEslint = require('typescript-eslint');
const skyux = require('../../dist/libs/sdk/skyux-eslint/src');
const config = require('../../eslint-apps.config');

module.exports = tsEslint.config(
  ...config,
  {
    files: ['**/src/app/code-examples/**/*.ts'],
    extends: [...skyux.configs.tsAll],
  },
  {
    files: ['**/src/app/code-examples/**/*.html'],
    extends: [...skyux.configs.templateAll],
  },
);
