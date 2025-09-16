import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Page Data Manager Split View', () => {
  E2eVariations.forEachTheme((theme) => {
    beforeEach(() => {
      cy.visit('/')
        .skyChooseTheme(theme)
        .get('a[href="#/integrations/page-data-manager-split-view"]')
        .click();
      cy.skyReady('app-page-data-manager-split-view').end();
    });

    E2eVariations.DISPLAY_WIDTHS.concat(E2eVariations.MOBILE_WIDTHS).forEach(
      (width) => {
        it(`should render the page with split view inside data manager at ${width}px`, () => {
          cy.viewport(width, 960);
          cy.get('h1')
            .should('be.visible')
            .should('contain.text', 'Data manager with split view in page');

          cy.get('sky-data-manager').should('exist').should('be.visible');

          cy.get('sky-split-view').should('exist').should('be.visible');

          cy.skyVisualTest(`page-data-manager-split-view-${theme}`);
        });
      },
    );
  }, false);
});
