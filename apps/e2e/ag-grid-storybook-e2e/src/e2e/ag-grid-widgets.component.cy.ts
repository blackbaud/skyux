import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('ag-grid-widgets', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      const compactOptions = theme.startsWith('modern')
        ? [false, true]
        : [false];
      compactOptions.forEach((compact) => {
        it(`should render ag-grid-widgets in ${theme}${compact ? '-compact' : ''} theme`, () => {
          cy.viewport(1024, 1500).visit(
            // eslint-disable-next-line @cspell/spellchecker
            `/iframe.html?globals=theme:${theme}&id=ag-grid-widgetscomponent--ag-grid-widgets${compact ? '-compact' : ''}`,
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
            `ag-grid-widgets-${theme}${compact ? '-compact' : ''}`,
            {
              overwrite: true,
              disableTimersAndAnimations: true,
            },
          );
        });
      });
    });
  });
});
