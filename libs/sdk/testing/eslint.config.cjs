const prettier = require('eslint-config-prettier');
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
