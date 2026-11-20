const nx = require('@nx/eslint-plugin');
const cspell = require('@cspell/eslint-plugin/recommended');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/__mocks__/**',
      '.angular/**',
      '.nx/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
    ],
  },
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
          ignoredDependencies: ['rxjs, tslib, @blackbaud/skyux-design-tokens'],
        },
      ],
    },
    languageOptions: { parser: require('jsonc-eslint-parser') },
  },
  {
    files: [
      '**/*.ts',
      '**/*.cts',
      '**/*.mts',
      '**/*.tsx',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.jsx',
    ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@angular-devkit/*/src/*'],
              message:
                'Import from the package entry point instead. Deep paths are private and are blocked by "exports" maps (e.g. @angular-devkit/schematics 22.3+).',
            },
          ],
        },
      ],
    },
  },
  cspell,
];
