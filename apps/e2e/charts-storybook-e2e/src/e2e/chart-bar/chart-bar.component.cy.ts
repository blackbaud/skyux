import { E2eVariations } from '@skyux-sdk/e2e-schematics';

// Data point interaction states are drawn on the canvas, so they are driven
// with synthetic events rather than story args.
function getDataPoint(
  category: string,
  series: string,
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get(
    `#actual-vs-target-chart .sky-chart-data-point[data-sky-chart-category="${category}"][data-sky-chart-series="${series}"]`,
  );
}

// Moves the pointer to the center of a data point. The focusable stand-ins
// share the canvas's coordinate space and ignore pointer events.
function hoverDataPoint(category: string, series: string): void {
  getDataPoint(category, series).then(([dataPoint]) => {
    const { left, top, width, height } = dataPoint.style;

    cy.get('#actual-vs-target-chart canvas').trigger(
      'mousemove',
      parseFloat(left) + parseFloat(width) / 2,
      parseFloat(top) + parseFloat(height) / 2,
    );
  });
}

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

      for (const orientation of ['vertical', 'horizontal']) {
        describe(`with ${orientation} bars`, () => {
          beforeEach(() => {
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=chart-barcomponent--${orientation}`,
            );
            cy.skyReady('app-chart-bar').end();
          });

          it('should render a hovered data point', () => {
            hoverDataPoint('2013', 'Actual');

            cy.get('#actual-vs-target-chart').skyVisualTest(
              `chart-bar-${orientation}-data-point-hover-${theme}`,
              { overwrite: true, disableTimersAndAnimations: true },
            );
          });

          it('should render a pressed data point', () => {
            hoverDataPoint('2013', 'Actual');
            cy.get('#actual-vs-target-chart canvas').trigger('pointerdown');

            cy.get('#actual-vs-target-chart').skyVisualTest(
              `chart-bar-${orientation}-data-point-active-${theme}`,
              { overwrite: true, disableTimersAndAnimations: true },
            );
          });

          it('should render a focused data point', () => {
            getDataPoint('2013', 'Actual').focus();

            cy.get('#actual-vs-target-chart').skyVisualTest(
              `chart-bar-${orientation}-data-point-focus-${theme}`,
              { overwrite: true, disableTimersAndAnimations: true },
            );
          });
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
