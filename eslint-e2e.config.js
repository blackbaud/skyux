const prettier = require('eslint-config-prettier');
const cypress = require('eslint-plugin-cypress/flat');
const baseConfig = require('./eslint.config');
const overrides = require('./eslint-overrides.config');

module.exports = [
  cypress.configs['recommended'],
  ...baseConfig,
  ...overrides,
  prettier,
];
