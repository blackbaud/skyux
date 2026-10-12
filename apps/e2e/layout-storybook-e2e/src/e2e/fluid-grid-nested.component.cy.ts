import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('fluid-grid-nested', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(E2eVariations.DISPLAY_WIDTHS[0], 1080)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=fluid-grid-nestedcomponent--fluid-grid-nested`,
          ),
      );

      it('should render the component', () => {
        cy.skyReady('app-fluid-grid-nested').screenshot(
          `fluid-grid-nested-${theme}`,
        );
        cy.percySnapshot(`fluid-grid-nested-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
