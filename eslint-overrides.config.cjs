module.exports = [
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { overrides: { constructors: 'no-public' } },
      ],
      complexity: ['warn', { max: 10 }],
      curly: 'error',
      eqeqeq: ['error', 'always'],
      'max-depth': ['error', { max: 5 }],
      'no-restricted-syntax': ['error', 'ExportAllDeclaration'],
    },
  },
];
