const appsConfig = require('./eslint-apps.config');

module.exports = [
  ...appsConfig,
  {
    files: ['**/.storybook/*.ts'],
    rules: {
      'no-restricted-syntax': ['warn'],
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/prefer-control-flow': ['warn'],
    },
  },
];
