import { forEachThemeAndBrand } from '../support/themes';

describe('viewkeeper-tabset', () => {
  forEachThemeAndBrand((theme) => {
    describe(`in ${theme} theme`, () => {
      it('should show the viewkeeper tabset', () => {
        cy.viewport('ipad-2', 'landscape');
        cy.visit('/#/integrations/viewkeeper-tabset');
        cy.skyReady('app-viewkeeper-tabset');
        cy.skyChooseTheme(theme);
        cy.get('#tabTriggerBtn').should('be.visible').click();
        cy.get('#sky-tab-2-nav-btn').should('be.visible').click();
        cy.get('.el1,.el2').should('be.visible').should('have.length', 3);
        cy.get('.tab-2-content').scrollIntoView();
        cy.get('.el1,.el2')
          .should('be.visible')
          .should('have.length', 3)
          .should('have.class', 'sky-viewkeeper-fixed');
      });
    });
  });
});
