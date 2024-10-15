const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const path = require('node:path');
const config = require('../../eslint-apps.config');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...config,
  ...compat
    .config({
      extends: ['../../libs/sdk/eslint-config/recommended'],
    })
    .map((config) => ({
      files: ['**/src/app/code-examples/**/*.ts'],
      languageOptions: {
        ...config.languageOptions,
        parserOptions: {
          project: [path.join(__dirname, 'tsconfig.editor.json')],
          tsconfigRootDir: '.',
        },
      },
      linterOptions: { reportUnusedDisableDirectives: true },
      rules: {
        ...config.rules,
        'no-alert': 'warn',
        'no-console': 'warn',
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['../*'],
                message: 'Make sure to import from local files only.',
              },
            ],
          },
        ],
      },
    })),
];
