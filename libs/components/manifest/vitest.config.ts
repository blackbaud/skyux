import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: '../../../node_modules/.vite',
  test: {
    reporters: ['default'],
    coverage: {
      all: true,
      enabled: true,
      exclude: ['src/**/*.test.ts'],
      include: ['src/**/*.ts'],
      reporter: ['text', 'json', 'html'],
      reportsDirectory: '../../../coverage/libs/components/manifest',
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
