import { skyE2ePreset } from '@skyux-sdk/e2e-schematics/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...skyE2ePreset(__dirname),
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
