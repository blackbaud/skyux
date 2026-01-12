import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('data-grid', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=data-gridcomponent--data-grid`,
        ),
      );

      it('should render the component', () => {
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
