import { sendCypressScreenshotsToPercy } from '@skyux-sdk/e2e-schematics';
import { skyE2ePreset } from '@skyux-sdk/e2e-schematics/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...skyE2ePreset(__dirname),
    setupNodeEvents: (on, config) => {
      sendCypressScreenshotsToPercy(on, config);
    },
  },
});
