import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 1200);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=datavizcolorscomponent-data-viz-colors--data-viz-colors`,
        );
      });
      it('should render the component', () => {
        cy.skyReady('app-data-viz-colors')
          .end()
          .document()
          .screenshot(
            `datavizcolorscomponent-data-viz-colors--data-viz-colors-${theme}`,
          );
        cy.document().percySnapshot(
          `datavizcolorscomponent-data-viz-colors--data-viz-colors-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
