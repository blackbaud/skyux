import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Page Data Manager Split View', () => {
  E2eVariations.forEachTheme((theme) => {
    E2eVariations.DISPLAY_WIDTHS.concat(E2eVariations.MOBILE_WIDTHS).forEach(
      (width) => {
        it(`should render the page with split view inside data manager in ${theme} at ${width}px`, () => {
          cy.viewport(width, 960)
            .visit('/')
            .skyChooseTheme(theme)
            .get('a[href="#/integrations/page-data-manager-split-view"]')
            .click();
          cy.skyReady('app-page-data-manager-split-view')
            .get('h1.sky-page-header-text')
            .should('be.visible')
            .should('contain.text', 'Split view in data manager');

          cy.get('.sky-data-manager').should('exist').should('be.visible');

          cy.get('sky-split-view').should('exist').should('be.visible');

          cy.skyVisualTest(`page-data-manager-split-view-${theme}-${width}`);
        });
      },
    );
  });
});
