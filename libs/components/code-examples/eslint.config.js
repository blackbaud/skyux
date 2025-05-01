// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const skyux = require('../../sdk/skyux-eslint/dev-transpiler.cjs');
const prettier = require('eslint-config-prettier');

/**
 * This configuration does not import the repo's shared configs so that we can
 * mimic what a consumer's project would use.
 */
module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
      ...skyux.configs.tsAll,
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
  prettier,
);
