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
    // Rules from strict-type-checked
    // Should we include these in the base ruleset?
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/no-deprecated': 'error',
    '@typescript-eslint/no-mixed-enums': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-return-this-type': 'error',

    // "Floating" rules
    '@typescript-eslint/switch-exhaustiveness-check': [
      'error',
      {
        considerDefaultExhaustiveForUnions: true,
      },
    ],
  },
} satisfies TSESLint.FlatConfig.Config;

/**
 * ===============================
 * ruleset: stylistic-type-checked <--
 * ===============================
 *
 * @typescript-eslint/dot-notation
 * @typescript-eslint/non-nullable-type-assertion-style
 * @typescript-eslint/prefer-includes
 * @typescript-eslint/prefer-nullish-coalescing
 * @typescript-eslint/prefer-optional-chain
 * @typescript-eslint/prefer-string-starts-ends-with
 *
 * =================================
 * ruleset: recommended-type-checked <--
 * =================================
 *
 * @typescript-eslint/no-base-to-string
 * @typescript-eslint/no-redundant-type-constituents
 * @typescript-eslint/unbound-method
 *
 * ===================
 * strict-type-checked <-- not considered SemVer safe
 * ===================
 *
 * @typescript-eslint/no-confusing-void-expression
 * @typescript-eslint/no-deprecated
 * @typescript-eslint/no-mixed-enums
 * @typescript-eslint/prefer-reduce-type-parameter
 * @typescript-eslint/prefer-return-this-type
 *
 */
