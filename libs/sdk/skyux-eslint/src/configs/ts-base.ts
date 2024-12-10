import type { TSESLint } from '@typescript-eslint/utils';

import tsPlugin from '../plugins/ts-plugin';

export default {
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  name: 'skyux-eslint/ts-base',
  plugins: {
    'skyux-eslint': tsPlugin,
  },
  rules: {
    // JavaScript ESLint rules (floating)
    curly: 'error',
    'default-case': 'error',
    'default-case-last': 'error',
    eqeqeq: ['error', 'always'],
    'guard-for-in': 'error',
    'id-denylist': [
      'error',
      'any',
      'boolean',
      'Boolean',
      'number',
      'Number',
      'object',
      'Object',
      'string',
      'String',
      'undefined',
      'Undefined',
    ],
    'no-alert': 'error',
    'no-caller': 'error',
    'no-console': 'error',
    'no-constructor-return': 'error',
    'no-duplicate-imports': ['error', { includeExports: true }],
    'no-eval': 'error',
    'no-lonely-if': 'error',
    'no-mixed-operators': 'error',
    'no-new-wrappers': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'error',
    'no-useless-return': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-regex-literals': 'error',
    radix: 'error',
    'require-atomic-updates': 'error',

    // Angular ESLint rules (floating)
    '@angular-eslint/no-lifecycle-call': 'error',
    '@angular-eslint/sort-ngmodule-metadata-arrays': 'error',

    // TypeScript ESLint rules (floating)
    'default-param-last': 'off',
    '@typescript-eslint/default-param-last': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { overrides: { constructors: 'no-public' } },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        allowNamedExports: false,
      },
    ],

    // TypeScript ESLint rules (strict)
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-literal-enum-member': 'error',
  },
} satisfies TSESLint.FlatConfig.Config;

/**
 * ======================
 * @eslint/js/recommended <--
 * ======================
 *
 * no-constant-binary-expression
 * no-unused-private-class-members
 *
 * ============================
 * @typescript-eslint/stylistic <--
 * ============================
 *
 * @typescript-eslint/array-type
 * @typescript-eslint/ban-tslint-comment
 * @typescript-eslint/consistent-generic-constructors
 * @typescript-eslint/no-confusing-non-null-assertion
 * @typescript-eslint/prefer-for-of
 * @typescript-eslint/prefer-function-type
 *
 * ==============================
 * @typescript-eslint/recommended <--
 * ==============================
 *
 * @typescript-eslint/no-duplicate-enum-values
 * @typescript-eslint/no-unsafe-declaration-merging
 * @typescript-eslint/no-unused-expressions
 *
 * =========================
 * @typescript-eslint/strict <-- not considered SemVer safe
 * =========================
 *
 * @typescript-eslint/no-non-null-asserted-nullish-coalescing
 * @typescript-eslint/prefer-literal-enum-member
 */
