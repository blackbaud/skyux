import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('modal-viewkept-toolbars', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport('ipad-2', 'landscape');
        cy.visit('/#/integrations/modal-viewkeeper');
      });

      it('verify viewkept toolbar in modal', () => {
        cy.get('#modal-viewkept-toolbars-modal-trigger')
          .should('be.visible')
          .should('contain', 'Open modal')
          .click();
        cy.get('sky-modal-header')
          .should('be.visible')
          .should('contain', 'Viewkeeper inside a Modal');
        cy.get('.sky-lookup-show-more-modal-toolbar').should('be.visible');
        cy.get('.sky-lookup-show-more-modal-multiselect-toolbar').should(
          'be.visible'
        );
        cy.get('sky-modal-content > p:nth-child(2)').should('be.visible');
        cy.get('.sky-modal-content').should('be.visible').scrollTo('bottom');
        cy.get('sky-modal-content > p:nth-child(2)').should('not.be.visible');
        cy.get('.sky-lookup-show-more-modal-toolbar').should('be.visible');
        cy.get('.sky-lookup-show-more-modal-multiselect-toolbar').should(
          'be.visible'
        );
        cy.window()
          .screenshot(`modal-viewkept-toolbars-${theme}`)
          .percySnapshot(`modal-viewkept-toolbars-${theme}`);
      });
    });
  });
});
