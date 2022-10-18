import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

const cypressJsonConfig = {
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  videosFolder: '../../../dist/cypress/apps/e2e/ag-grid-storybook-e2e/videos',
  screenshotsFolder:
    '../../../dist/cypress/apps/e2e/ag-grid-storybook-e2e/screenshots',
  chromeWebSecurity: false,
  specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  supportFile: 'src/support/e2e.ts',
};
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
  },
});
