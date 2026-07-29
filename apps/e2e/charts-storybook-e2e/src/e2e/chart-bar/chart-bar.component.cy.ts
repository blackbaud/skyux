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

          cy.get('app-chart-bar')
            .should('exist')
            .should('be.visible')
            .screenshot(`chart-bar-${orientation}-${theme}`);
          cy.percySnapshot(`chart-bar-${orientation}-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
        });
      }
    });
  });
});
