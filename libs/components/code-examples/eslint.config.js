const tsEslint = require('typescript-eslint');
const config = require('../../../eslint-libs.config');

module.exports = tsEslint.config(...config, {
  files: ['**/*.ts'],
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
  },
});

// const tsEslint = require('typescript-eslint');
// const config = require('../../../eslint-libs.config');
// const skyux = require('../../sdk/skyux-eslint/dev-transpiler.cjs');

// module.exports = tsEslint.config(
//   ...config,
//   {
//     files: ['**/*.ts'],
//     extends: [...skyux.configs.tsAll],
//     rules: {
//       '@angular-eslint/directive-selector': [
//         'error',
//         {
//           type: 'attribute',
//           prefix: 'app',
//           style: 'camelCase',
//         },
//       ],
//       '@angular-eslint/component-selector': [
//         'error',
//         {
//           type: 'element',
//           prefix: 'app',
//           style: 'kebab-case',
//         },
//       ],
//       '@nx/enforce-module-boundaries': 'warn',
//       '@typescript-eslint/no-deprecated': 'warn',
//       'no-alert': 'warn',
//       'no-console': 'warn',
//     },
//   },
//   {
//     files: ['**/*.html'],
//     extends: [...skyux.configs.templateAll],
//     rules: {
//       'skyux-eslint-template/no-deprecated-directives': 'warn',
//       'skyux-eslint-template/no-legacy-icons': 'warn',
//     },
//   },
// );
