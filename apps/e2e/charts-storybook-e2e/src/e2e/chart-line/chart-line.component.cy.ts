import { E2eVariations } from '@skyux-sdk/e2e-schematics';

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
    });
  });
});
