export const plugins = ['deprecation'];

export const rules = {
  /**
   * Plugin rules
   */
  'deprecation/deprecation': 'warn',

  /**
   * ESLint rules
   */
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
  'no-constant-binary-expression': 'error',
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
  'no-unused-private-class-members': 'error',
  'no-use-before-define': [
    'error',
    { functions: false, classes: true, variables: true },
  ],
  'no-useless-return': 'error',
  'prefer-arrow-callback': 'error',
  'prefer-regex-literals': 'error',
  radix: 'error',
  'require-atomic-updates': 'error',

  /**
   * TypeScript rules
   */
  '@typescript-eslint/array-type': 'error',
  '@typescript-eslint/ban-tslint-comment': 'error',
  '@typescript-eslint/consistent-generic-constructors': 'error',
  // Disable the base rule as it can report incorrect errors.
  'default-param-last': 'off',
  '@typescript-eslint/default-param-last': 'error',
  // Disable the base rule as it can report incorrect errors.
  'dot-notation': 'off',
  '@typescript-eslint/dot-notation': 'error',
  '@typescript-eslint/explicit-member-accessibility': 'error',
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/no-base-to-string': 'error',
  '@typescript-eslint/no-confusing-non-null-assertion': 'error',
  '@typescript-eslint/no-confusing-void-expression': 'error',
  '@typescript-eslint/no-duplicate-enum-values': 'error',
  '@typescript-eslint/no-mixed-enums': 'error',
  '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
  '@typescript-eslint/no-redundant-type-constituents': 'error',
  // Disable the base rule as it can report incorrect errors.
  'no-shadow': 'off',
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-unsafe-declaration-merging': 'error',
  // Disable the base rule as it can report incorrect errors.
  'no-unused-expressions': 'off',
  '@typescript-eslint/no-unused-expressions': 'error',
  '@typescript-eslint/non-nullable-type-assertion-style': 'error',
  '@typescript-eslint/prefer-for-of': 'error',
  '@typescript-eslint/prefer-function-type': 'error',
  '@typescript-eslint/prefer-includes': 'error',
  '@typescript-eslint/prefer-literal-enum-member': 'error',
  // This rule will not work as expected if strictNullChecks is not enabled.
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  // There are a few edge cases where this rule will have a false positive. Use your best judgement when evaluating reported errors.
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/prefer-reduce-type-parameter': 'error',
  '@typescript-eslint/prefer-return-this-type': 'error',
  '@typescript-eslint/prefer-string-starts-ends-with': 'error',
  '@typescript-eslint/semi': 'error',
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
  '@typescript-eslint/type-annotation-spacing': 'error',
  '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],

  /**
   * Angular rules
   */
  '@angular-eslint/no-lifecycle-call': 'error',
  // eslint-disable-next-line @cspell/spellchecker
  '@angular-eslint/sort-ngmodule-metadata-arrays': 'error',
};

export const reportUnusedDisableDirectives = true;
