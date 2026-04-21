import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: '../../../../node_modules/.vite',
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['libs/sdk/testing/private/src/**/*.spec.ts'],
  },
});
