import { skyThemes } from '@skyux-sdk/e2e-schematics';

import { agGridVariants } from '../support/ag-grid-variants';

describe('ag-grid-native-multiselect', () => {
  agGridVariants.forEach(({ compact, themes }) => {
    describe(compact ? 'compact' : 'standard', () => {
      skyThemes(themes);

      it('should render native multiselect checkbox states', () => {
        cy.viewport(1024, 2000).visit(
          // eslint-disable-next-line @cspell/spellchecker
          `/iframe.html?id=ag-grid-native-multiselectcomponent--ag-grid-native-multiselect${compact ? '-compact' : ''}`,
        );

        cy.skyReady('app-ag-grid-multiselect', ['#ready']);

        cy.get('#storybook-root').skyVisualTest(
          // eslint-disable-next-line @cspell/spellchecker
          `aggridnativemultiselectcomponent-aggridnativemultiselect--{theme}${compact ? '-compact' : ''}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
            capture: 'fullPage',
          },
        );
      });
    });
  });
});
