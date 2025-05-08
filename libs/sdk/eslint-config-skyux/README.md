# eslint-config-skyux (Developer Preview)

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test eslint-config-skyux` to execute the unit tests via [Jest](https://jestjs.io).

## Implement in eslint.config.js

```
// @ts-check
const skyux = require('eslint-config-skyux');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  ...skyux,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
);
```
