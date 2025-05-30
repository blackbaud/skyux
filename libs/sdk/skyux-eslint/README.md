# skyux-eslint

## Install

```
ng add skyux-eslint
```

## Implement in eslint.config.mjs

```
// @ts-check
import eslint from '@eslint/js';
import angular from 'angular-eslint';
import skyux from 'skyux-eslint';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      ...skyux.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // ...
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      ...skyux.configs.templateRecommended,
    ],
    rules: {},
  },
);
```
