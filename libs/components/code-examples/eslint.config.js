const eslint = require('@eslint/js');
const tsEslint = require('typescript-eslint');
const angular = require('angular-eslint');
const config = require('../../../eslint-libs.config');
const skyux = require('../../sdk/skyux-eslint/dev-transpiler.cjs');

module.exports = tsEslint.config(
  ...config,
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tsEslint.configs.recommendedTypeChecked,
      ...tsEslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
      ...skyux.configs.tsStrictTypeChecked,
    ],
    processor: angular.processInlineTemplates,
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
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      ...skyux.configs.templateAll,
    ],
    rules: {
      'skyux-eslint-template/no-deprecated-directives': 'warn',
    },
  },
);
