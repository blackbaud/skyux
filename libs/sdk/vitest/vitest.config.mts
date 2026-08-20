import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const root = resolve(__dirname, '../../..');

export default defineConfig({
  cacheDir: '../../../node_modules/.vite',
  resolve: {
    alias: {
      '@skyux/i18n': resolve(root, 'libs/components/i18n/src/index.ts'),
      '@skyux/assets': resolve(root, 'libs/components/assets/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.spec.ts'],
    setupFiles: [resolve(__dirname, 'src/testing/setup-test-env.ts')],
    coverage: {
      enabled: true,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/testing/**', 'src/index.ts'],
      reportsDirectory: '../../../coverage/libs/sdk/vitest',
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
