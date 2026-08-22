# @skyux-sdk/vitest

Custom Vitest matchers for testing SKY UX applications.

## Install

```shell
ng add @skyux-sdk/vitest
```

This adds the package and its `axe-core` peer dependency to your `devDependencies`.

## Setup

These steps assume your project already runs its tests with Vitest through the `@angular/build:unit-test` builder.

### 1. Register the matchers

Add the setup file to your project's `test` target. The builder resolves each entry in `setupFiles` from the workspace root.

**angular.json**

```json
{
  "projects": {
    "my-project": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "setupFiles": ["node_modules/@skyux-sdk/vitest/matchers-setup.mjs"]
          }
        }
      }
    }
  }
}
```

### 2. Add the matcher types

Add `@skyux-sdk/vitest/globals` to the `types` in your `tsconfig.spec.json`, alongside `vitest/globals`.

**tsconfig.spec.json**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["vitest/globals", "@skyux-sdk/vitest/globals"]
  },
  "include": ["src/**/*.d.ts", "src/**/*.spec.ts"]
}
```
