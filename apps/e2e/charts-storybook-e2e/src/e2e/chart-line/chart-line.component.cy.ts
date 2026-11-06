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

  // Chart.js handles pointer events on the next animation frame, so wait for
  // it to register the hover before continuing.
  cy.window().then(
    (win) =>
      new Cypress.Promise<void>((resolve) =>
        win.requestAnimationFrame(() => resolve()),
      ),
  );
}

describe('ChartLine', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      it('should render line charts', () => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=chart-linecomponent--default`,
        );

        cy.skyReady('app-chart-line').end();

        cy.get('app-chart-line').skyVisualTest(`chart-line-${theme}`, {
          overwrite: true,
          disableTimersAndAnimations: true,
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });

      describe('data point states', () => {
        beforeEach(() => {
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=chart-linecomponent--default`,
          );
          cy.skyReady('app-chart-line').end();
        });

        it('should render a hovered data point', () => {
          hoverDataPoint('2013', 'Target');

          cy.get('#actual-vs-target-chart').skyVisualTest(
            `chart-line-data-point-hover-${theme}`,
            { overwrite: true, disableTimersAndAnimations: true },
          );
        });

        it('should render a pressed data point', () => {
          hoverDataPoint('2013', 'Target');
          cy.get('#actual-vs-target-chart canvas').trigger('pointerdown');

          cy.get('#actual-vs-target-chart').skyVisualTest(
            `chart-line-data-point-active-${theme}`,
            { overwrite: true, disableTimersAndAnimations: true },
          );
        });

        it('should render a focused data point', () => {
          getDataPoint('2013', 'Target').focus();

          cy.get('#actual-vs-target-chart').skyVisualTest(
            `chart-line-data-point-focus-${theme}`,
            { overwrite: true, disableTimersAndAnimations: true },
          );
        });
      });
    });
  });
});
