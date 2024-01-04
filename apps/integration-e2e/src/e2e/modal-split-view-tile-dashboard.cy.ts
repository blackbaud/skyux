import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Modal Split View Tile Dashboard', () => {
  E2eVariations.forEachTheme((theme) => {
    [1600, 1100, 600].forEach((width) => {
      it(`should show tile dashboard in ${width}x900 viewport, ${theme} theme`, () => {
        cy.viewport(width, 900)
          .visit('/')
          .skyChooseTheme(theme)
          .get('a[href="#/integrations/modal-split-view-tile-dashboard"]')
          .click();
        cy.url()
          .should('include', '#/integrations/modal-split-view-tile-dashboard')
          .get('app-modal-split-view-tile-dashboard button:first-of-type')
          .should('be.visible')
          .should('contain.text', 'Open modal')
          .click();
        cy.get('sky-modal-header')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Modal title');
        cy.get('sky-tile-title')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Test header');
        const singleOrMulti = width < 1200 ? 'single' : 'multi';
        cy.get(
          `
          sky-tile-dashboard.sky-tile-dashboard-${singleOrMulti}-column
          sky-tile-dashboard-column.sky-tile-dashboard-layout-${singleOrMulti}
          sky-tile-title
          `,
        )
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Tile 2');
      });
    });
  });
});
