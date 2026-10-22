import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/sdk/cypress-commands',
  plugins: [nxViteTsPaths()],
  test: {
    name: '@skyux-sdk/cypress-commands',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/libs/sdk/cypress-commands',
      provider: 'v8' as const,
    },
  },
}));
