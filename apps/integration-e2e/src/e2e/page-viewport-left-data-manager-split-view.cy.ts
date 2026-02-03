import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Page Viewport Left Data Manager Split View', () => {
  E2eVariations.forEachTheme((theme) => {
    it(`should render the page with split view inside data manager with viewport left set to mimic vertical nav`, () => {
      cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 1200)
        .visit('/')
        .skyChooseTheme(theme)
        .get('a[href="#/integrations/page-data-manager-split-view"]')
        .click();
      cy.document().then((doc) => {
        doc.documentElement.style.setProperty('--sky-viewport-left', '250px');
      });
      cy.skyReady('app-page-data-manager-split-view')
        .get('h1.sky-page-header-text')
        .should('be.visible')
        .should('contain.text', 'Split view in data manager');

      cy.get('.sky-data-manager').should('exist').should('be.visible');

      cy.get('sky-split-view').should('exist').should('be.visible');

      cy.skyVisualTest(`page-viewport-left-data-manager-split-view`);
    });
  });
});
