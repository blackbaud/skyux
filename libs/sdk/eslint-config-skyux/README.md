# eslint-config-skyux

## Prerequisites

- An Angular project using version 19 or higher
- The [`angular-eslint`](https://github.com/angular-eslint/angular-eslint/tree/main) package must be set up before installing `eslint-config-skyux`

## Install

After setting up `angular-eslint`, run:

```
ng add eslint-config-skyux
```

## Implement in eslint.config.mjs

```
// @ts-check
import skyux from 'eslint-config-skyux';
import tseslint from 'typescript-eslint';

export default tseslint.config(
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
    files: ['**/*.ts'],
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
