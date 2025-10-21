import eslint from '@eslint/js';

import angular from 'angular-eslint';
import skyux from 'skyux-eslint';
import tseslint from 'typescript-eslint';

const config = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...angular.configs.tsRecommended,
      ...skyux.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...skyux.configs.templateRecommended,
    ],
  },

  /**
   * Additional JavaScript rules.
   */
  {
    files: ['**/*.ts'],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
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
    },
  },

  /**
   * Additional angular-eslint rules.
   */
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/no-lifecycle-call': 'error',
      '@angular-eslint/template/no-inline-styles': [
        'error',
        { allowBindToStyle: true, allowNgStyle: true },
      ],
    },
  },

  /**
   * Additional typescript-eslint rules.
   */
  {
    files: ['**/*.ts'],
    rules: {
      // Floating rules that don't belong in a typescript-eslint ruleset.
      // ================================================================
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
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        {
          considerDefaultExhaustiveForUnions: true,
        },
      ],

      // Overrides from typescript-eslint's "recommendedTypeChecked" ruleset.
      // ====================================================================
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],

      // Cherry-picked rules from typescript-eslint's "strict" ruleset.
      // We can't pull in the entire ruleset because it's not considered
      // SemVer safe.
      // ==============================================================-
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-literal-enum-member': 'error',

      // Cherry-picked rules from typescript-eslint's "strictTypeChecked"
      // ruleset.
      // ================================================================
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-return-this-type': 'error',

      // Cherry-picked rules from typescript-eslint's "stylistic" ruleset.
      // ================================================================-
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/consistent-generic-constructors': 'error',
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',

      // Cherry-picked rules from typescript-eslint's "stylisticTypeChecked"
      // ruleset.
      // ==================================================================-
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignorePrimitives: { bigint: true, number: true, string: true } },
      ],
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    },
  },
);

// CommonJS
export = config;
