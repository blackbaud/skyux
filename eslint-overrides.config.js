const tsEslint = require('typescript-eslint');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { overrides: { constructors: 'no-public' } },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      'require-await': 'off',
      '@typescript-eslint/require-await': 'error',
      'no-return-await': 'off',
      '@typescript-eslint/return-await': ['error', 'always'],
      complexity: ['warn', { max: 10 }],
      curly: 'error',
      eqeqeq: ['error', 'always'],
      'max-depth': ['error', { max: 5 }],
      'no-restricted-syntax': ['error', 'ExportAllDeclaration'],
    },
  },
  {
    files: ['**/*.spec.ts', '**/fixtures/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
];
