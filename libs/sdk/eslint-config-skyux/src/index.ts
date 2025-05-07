// @ts-check
import eslint from '@eslint/js';

import angular from 'angular-eslint';
import skyux from 'skyux-eslint';
import tseslint from 'typescript-eslint';

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...angular.configs.tsRecommended,
      ...skyux.configs.tsRecommended,
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
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...skyux.configs.templateAll,
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
      // Angular rules
      '@angular-eslint/no-lifecycle-call': 'error',
      /**
       * Disable the `@angular-eslint/prefer-standalone` ESLint rule to address an
       * issue with its "fix" implementation.
       * @see https://github.com/angular-eslint/angular-eslint/issues/2206
       */
      '@angular-eslint/prefer-standalone': 'off',
    },
  },

  /**
   * Additional typescript-eslint rules.
   */
  {
    files: ['**/*.ts'],
    rules: {
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
      // Cherry-picked rules from typescript-eslint's "strict" ruleset.
      // We can't pull in the entire ruleset because it's not considered SemVer safe.
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-literal-enum-member': 'error',
    },
  },
);
