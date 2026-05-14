import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const root = resolve(__dirname, '../../../..');

export default defineConfig({
  cacheDir: '../../../../node_modules/.vite',
  resolve: {
    alias: {
      '@skyux/i18n': resolve(root, 'libs/components/i18n/src/index.ts'),
      '@skyux/assets': resolve(root, 'libs/components/assets/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['libs/sdk/testing/vitest/src/**/*.integration.spec.ts'],
    setupFiles: [
      resolve(__dirname, 'src/testing/setup-angular-testbed.ts'),
      resolve(
        __dirname,
        '../../../..',
        'dist/libs/sdk/testing/fesm2022/skyux-sdk-testing-vitest.mjs',
      ),
    ],
  },
});
