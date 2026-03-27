import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: '../../../../node_modules/.vite',
  test: {
    environment: 'jsdom',
    include: ['libs/sdk/testing/vitest/src/**/*.integration.spec.ts'],
    setupFiles: [
      resolve(
        __dirname,
        '../../../..',
        'dist/libs/sdk/testing/fesm2022/skyux-sdk-testing-vitest.mjs',
      ),
    ],
  },
});
