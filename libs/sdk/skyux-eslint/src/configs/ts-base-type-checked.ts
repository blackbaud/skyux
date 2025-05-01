import type { TSESLint } from '@typescript-eslint/utils';

export default {
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: '.',
    },
  },
  name: 'skyux-eslint/ts-base-type-checked',
  rules: {
    // Cherry-picked rules from typescript-eslint's "strict-type-checked" ruleset.
    // We can't pull in the entire ruleset because it's not considered SemVer safe.
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/no-deprecated': 'error',
    '@typescript-eslint/no-mixed-enums': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-return-this-type': 'error',

    // Rules that aren't specific to a ruleset.
    '@typescript-eslint/switch-exhaustiveness-check': [
      'error',
      {
        considerDefaultExhaustiveForUnions: true,
      },
    ],
    // Using Angular validators (e.g. `Validators.required`) throws this error.
    // See: https://stackoverflow.com/a/68652060/6178885
    '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
  },
} satisfies TSESLint.FlatConfig.Config;
