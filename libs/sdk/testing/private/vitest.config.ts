import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: '../../../../node_modules/.vite',
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.spec.ts'],
    coverage: {
      enabled: true,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/index.ts'],
      reportsDirectory: '../../../../coverage/libs/sdk/testing/private',
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
