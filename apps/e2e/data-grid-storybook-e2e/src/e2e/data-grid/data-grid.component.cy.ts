import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('data-grid', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['auto', 'fixed', 'flex'].forEach((sizing) => {
        it(`should size the columns with ${sizing}`, () => {
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=data-gridcomponent--data-grid&args=columnFit:container;sizingVariant:${sizing}`,
          );
          cy.skyReady();
          cy.get('app-data-grid').should('exist').should('be.visible');
          cy.get(
            '[row-index="6"] [col-id="jobTitle"] sky-ag-grid-cell-renderer-template',
          )
            .should('exist')
            .should('be.visible')
            .should('have.text', 'UX Designer');
          cy.get(
            '[row-index="6"] [col-id="context"] button.sky-dropdown-button',
          )
            .should('exist')
            .should('be.visible')
            .should('be.enabled');
          cy.skyVisualTest(`data-grid-${sizing}-${theme}`);
        });
      });

      it(`should size the columns to fit content`, () => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=data-gridcomponent--data-grid&args=columnFit:content;sizingVariant:auto`,
        );
        cy.skyReady();
        cy.get('app-data-grid').should('exist').should('be.visible');
        cy.get(
          '[row-index="6"] [col-id="jobTitle"] sky-ag-grid-cell-renderer-template',
        )
          .should('exist')
          .should('be.visible')
          .should('have.text', 'UX Designer');
        cy.get('[row-index="6"] [col-id="context"] button.sky-dropdown-button')
          .should('exist')
          .should('be.visible')
          .should('be.enabled');
        cy.skyVisualTest(`data-grid-${theme}`);
      });
    });
  });
});
