import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { sendCypressScreenshotsToPercy } from '@skyux-sdk/e2e-schematics';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    video: false,
    defaultCommandTimeout: 60000,
    setupNodeEvents: (on, config) => {
      sendCypressScreenshotsToPercy(on, config);
    },
  },
});
