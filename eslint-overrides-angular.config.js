const overrides = require('./eslint-overrides.config');

module.exports = [
  ...overrides,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-inject': 'warn',
      '@angular-eslint/prefer-standalone': 'off',
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
    },
  },
  {
    files: ['**/*.spec.ts', '**/fixtures/**/*.ts'],
    rules: {
      '@nx/enforce-module-boundaries': 'warn',
      '@angular-eslint/component-selector': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
  {
    files: ['**/routes.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/alt-text': ['warn'],
      '@angular-eslint/template/attributes-order': ['error'],
      '@angular-eslint/template/button-has-type': ['error'],
      '@angular-eslint/template/click-events-have-key-events': ['warn'],
      '@angular-eslint/template/conditional-complexity': ['warn'],
      '@angular-eslint/template/cyclomatic-complexity': ['warn'],
      '@angular-eslint/template/elements-content': ['error'],
      '@angular-eslint/template/interactive-supports-focus': ['warn'],
      '@angular-eslint/template/label-has-associated-control': ['warn'],
      '@angular-eslint/template/no-any': ['error'],
      '@angular-eslint/template/no-autofocus': ['warn'],
      '@angular-eslint/template/no-distracting-elements': ['warn'],
      '@angular-eslint/template/no-inline-styles': [
        'warn',
        { allowBindToStyle: true, allowNgStyle: true },
      ],
      '@angular-eslint/template/no-interpolation-in-attributes': ['warn'],
      '@angular-eslint/template/no-positive-tabindex': ['warn'],
      '@angular-eslint/template/prefer-control-flow': ['error'],
      '@angular-eslint/template/prefer-ngsrc': ['warn'],
      '@angular-eslint/template/prefer-self-closing-tags': ['warn'],
      '@angular-eslint/template/role-has-required-aria': ['error'],
      '@angular-eslint/template/use-track-by-function': ['warn'],
      '@angular-eslint/template/valid-aria': ['error'],
    },
  },
];
