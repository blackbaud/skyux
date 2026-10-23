import { skyThemes } from '@skyux-sdk/e2e-schematics';

import { agGridVariants } from '../support/ag-grid-variants';

describe('ag-grid-widgets', () => {
  agGridVariants.forEach(({ compact, themes }) => {
    describe(compact ? 'compact' : 'standard', () => {
      skyThemes(themes);

      it('should render ag-grid-widgets', () => {
        cy.viewport(1024, 1500).visit(
          // eslint-disable-next-line @cspell/spellchecker
          `/iframe.html?id=ag-grid-widgetscomponent--ag-grid-widgets${compact ? '-compact' : ''}`,
        );
        cy.skyReady('app-ag-grid-widgets', ['#ready']);
        cy.get('.ag-header-cell[col-id="seasons_played"]')
          .should('exist')
          .first()
          .trigger('mouseenter');
        // Tooltip has a delay. Wait for it to appear.
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        cy.get('.ag-tooltip').should('exist');
        cy.get('#storybook-root').skyVisualTest(
          `ag-grid-widgets-{theme}${compact ? '-compact' : ''}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          },
        );
      });
    });
  });
});
