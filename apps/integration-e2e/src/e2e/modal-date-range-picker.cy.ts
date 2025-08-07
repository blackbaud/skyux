import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Modal Date range picker', () => {
  E2eVariations.forEachTheme((theme) => {
    it(`should render the date range picker component in a modal`, () => {
      cy.viewport(900, 768)
        .visit('/')
        .skyChooseTheme(theme)
        .get('a[href="#/integrations/modal-date-range-picker"]')
        .click();

      cy.skyReady('app-modal-date-range-picker');
      cy.url()
        .should('include', '#/integrations/modal-date-range-picker')
        .get('app-modal-date-range-picker button:first-of-type')
        .should('be.visible')
        .should('contain.text', 'Open modal')
        .click();
      cy.get('sky-modal-header')
        .should('be.visible')
        .should('contain', 'Date range picker inside a Modal');
      cy.get('.sky-date-range-picker-form-group')
        .should('exist')
        .should('have.length', 3);
      cy.skyVisualTest(`modal-date-range-picker-${theme}`);
    });
  }, false);
});
