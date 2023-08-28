import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .visit(
            `/iframe.html?globals=theme:${theme}&id=lookupcomponent-lookup--lookup`
          )
          .viewport(E2eVariations.DISPLAY_WIDTHS[0], 900)
      );
      it(`should render the component`, () => {
        cy.get('.ready').should('exist');
        cy.get('app-lookup').should('exist').should('be.visible');

        /* spell-checker:disable-next-line */
        cy.get('#single-enabled-novalue-show-more-add-new')
          .should('exist')
          .should('be.visible')
          .click();
        cy.get('.sky-autocomplete-actions')
          .should('exist')
          .should('be.visible');

        cy.get('body').skyVisualTest(`lookup-${theme}`, {
          disableTimersAndAnimations: true,
          overwrite: true,
        } as Partial<Cypress.ScreenshotOptions>);
      });
    });
  });
});
