import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('ChartBar', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      for (const orientation of ['vertical', 'horizontal']) {
        it(`should render ${orientation} bars`, () => {
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=chart-barcomponent--${orientation}`,
          );

          cy.skyReady('app-chart-bar').end();

          cy.get('app-chart-bar').skyVisualTest(
            `chart-bar-${orientation}-${theme}`,
            {
              overwrite: true,
              disableTimersAndAnimations: true,
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
        });
      }

      it('should render the data table modal', () => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=chart-barcomponent--vertical`,
        );
        cy.skyReady('app-chart-bar').end();

        cy.get('#floating-chart .sky-dropdown-button')
          .should('be.visible')
          .click();
        cy.get('.sky-dropdown-item button').should('be.visible').click();
        cy.get('sky-modal').should('be.visible');

        cy.skyVisualTest(`chart-bar-data-table-${theme}`, {
          capture: 'viewport',
          overwrite: true,
          disableTimersAndAnimations: true,
        });
      });
    });
  });
});
