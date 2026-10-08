import { skyThemes } from '@skyux-sdk/e2e-schematics';

import { agGridVariants } from '../support/ag-grid-variants';

describe(`ag-grid-storybook`, () => {
  agGridVariants.forEach(({ compact, themes }) => {
    describe(compact ? 'compact' : 'standard', () => {
      skyThemes(themes);

      it('should render the component', () => {
        cy.viewport(1300, 900).visit(
          `/iframe.html?id=ag-grid--ag-grid${compact ? '-compact' : ''}`,
        );

        cy.skyReady('app-ag-grid-stories', ['#ready']);

        // The component has actions in ngAfterViewInit that scroll a grid to show back-to-top as well as activate a
        // validation popover. These assertions verify those have happened.

        // Expect back to top button to be visible.
        cy.get('.sky-back-to-top').should('exist').should('be.visible');

        // Expect the validation message to be visible.
        cy.get('.sky-overlay sky-popover-content .sky-popover-body')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Expected a number between 1 and 18.');

        // Expect inline help buttons to be visible in three grids.
        cy.get('#row-delete [col-id="name"] button.sky-help-inline')
          .should('exist')
          .should('be.visible');

        cy.get('#back-to-top [col-id="name"] button.sky-help-inline')
          .should('exist')
          .should('be.visible');

        cy.get('#validation [col-id="name"] button.sky-help-inline')
          .should('exist')
          .should('be.visible');

        cy.get('#storybook-root')
          .should('exist')
          .should('be.visible')
          .skyVisualTest(
            /* eslint-disable-next-line @cspell/spellchecker */
            `aggridstoriescomponent-aggridstories--ag-grid-stories-{theme}${compact ? '-compact' : ''}`,
            {
              overwrite: true,
              disableTimersAndAnimations: true,
            },
          );
      });
    });
  });
});
