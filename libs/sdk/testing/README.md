# testing

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test testing` to execute the unit tests.

## Vitest setup

Add the following package subpath to your Vitest config `setupFiles`:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['@skyux-sdk/testing/vitest/setup-matchers.js'],
  },
});
```
