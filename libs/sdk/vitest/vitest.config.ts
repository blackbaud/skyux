import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const root = resolve(__dirname, '../../../');

export default defineConfig({
  resolve: {
    alias: {
      '@skyux/i18n': resolve(root, 'libs/components/i18n/src/index.ts'),
      '@skyux/assets': resolve(root, 'libs/components/assets/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
  },
});
