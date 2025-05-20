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
        projectService: true,
        tsconfigRootDir: '.',
      },
    },
  },
  {
    files: ['**/*.ts],
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
    }
  }
);
```
