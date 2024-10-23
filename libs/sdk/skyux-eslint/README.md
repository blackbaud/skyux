# skyux-eslint

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test skyux-eslint` to execute the unit tests via [Jest](https://jestjs.io).

## Implement in eslint.config.js

```
// @ts-check
const eslint = require("@eslint/js");
const angular = require("angular-eslint");
const skyux = require('skyux-eslint');
const tseslint = require("typescript-eslint");

module.exports = tsEslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      ...skyux.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // ...
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      ...skyux.configs.templateRecommended
    ],
  },
);
```

## Refresh deprecations summary for `skyux-eslint-template/no-deprecated-directives` rule

Note: Only do this for prerelease versions since updating the deprecations summary could result in a breaking change for our consumers.

```
npm run dev:refresh-skyux-eslint-deprecations-summary
```
