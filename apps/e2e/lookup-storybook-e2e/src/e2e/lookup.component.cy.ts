import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .visit(
            `/iframe.html?globals=theme:${theme}&id=lookupcomponent-lookup--lookup`
          )
          .viewport(1300, 900)
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

        cy.get('body')
          .screenshot(`lookup-${theme}`)
          .percySnapshot(`lookup-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
