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
          .get('button[title="Open full page modal"]')
          .should('be.visible')
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

    it(`should show tile dashboard in a modal with fit layout, ${theme} theme`, () => {
      cy.viewport(1100, 900)
        .visit('/')
        .skyChooseTheme(theme)
        .get('a[href="#/integrations/modal-split-view-tile-dashboard"]')
        .click();
      cy.url()
        .should('include', '#/integrations/modal-split-view-tile-dashboard')
        .get('button[title="Open large modal with fit layout"]')
        .should('be.visible')
        .click();
      cy.get('sky-modal-header')
        .should('exist')
        .should('be.visible')
        .should('contain.text', 'Modal title');
      cy.get('sky-tile-title')
        .should('exist')
        .should('be.visible')
        .should('contain.text', 'Test header');
      cy.get('.sky-modal').focus();
      cy.get('.sky-modal').should('have.focus');
      cy.skyVisualTest(`modal-split-view-tile-dashboard-fit-layout-${theme}`);
    });
  });
});
