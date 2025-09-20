const config = require('../../../eslint-libs.config');

module.exports = [
  ...config,
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/prefer-control-flow': ['warn'],
    },
  },
];
