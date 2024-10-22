// @ts-check
const tsEslint = require('typescript-eslint');
const skyux = require('../../libs/sdk/skyux-eslint/dev-transpiler.cjs');
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
