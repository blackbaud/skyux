import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('modal-viewkept-toolbars', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport('ipad-2', 'landscape');
        cy.visit('/#/integrations/modal-viewkeeper');
        cy.skyChooseTheme(theme);
      });

      it('verify viewkept toolbar in modal', () => {
        cy.get('#ready', { timeout: 10000 })
          .should('exist')
          .end()
          .get('#modal-viewkept-toolbars-modal-trigger')
          .should('be.visible')
          .should('contain', 'Open modal')
          .click();
        cy.get('sky-modal-header')
          .should('exist')
          .should('be.visible')
          .should('contain', 'Viewkeeper inside a Modal');
        cy.get('.sky-lookup-show-more-modal-toolbar')
          .should('exist')
          .should('be.visible');
        cy.get('.sky-lookup-show-more-modal-toolbar sky-icon[icon="search"]')
          .should('exist')
          .should('be.visible');
        cy.get(
          '.sky-lookup-show-more-modal-toolbar sky-icon[icon="search"] > i',
        )
          .should('exist')
          .should('be.visible')
          .should('have.css', 'height');
        cy.get('.sky-lookup-show-more-modal-multiselect-toolbar')
          .should('exist')
          .should('be.visible');
        cy.get('sky-modal-content > p:nth-child(2)').should('be.visible');
        cy.get('.sky-modal-content').should('be.visible').scrollTo('bottom');
        cy.get('sky-modal-content > p:nth-child(2)').should('not.be.visible');
        cy.get('.sky-lookup-show-more-modal-toolbar').should('be.visible');
        cy.get('sky-modal-content > .sky-viewkeeper-fixed').should(
          'satisfy',
          (el: JQuery<HTMLElement>) =>
            el.first() && parseFloat(el.first().css('opacity')) > 0.9,
        );
        cy.get(
          '.sky-lookup-show-more-modal-toolbar sky-icon[icon="search"] > i',
        ).should(
          'satisfy',
          (el: JQuery<HTMLElement>) =>
            el.first() && parseFloat(el.first().css('opacity')) > 0.9,
        );
        cy.get('.sky-lookup-show-more-modal-multiselect-toolbar').should(
          'be.visible',
        );
        cy.get('sky-icon[icon="search"]').should('be.visible');
        cy.window().skyVisualTest(`modal-viewkept-toolbars-${theme}`);
      });
    });
  });
});
