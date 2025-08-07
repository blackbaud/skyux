import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=pagecomponent-page--page`,
        ),
      );

      it('should constrain the contents of the page with layout fit to the available viewport', () => {
        cy.skyReady('.screenshot-area').screenshot(
          `pagecomponent-page--page-layout-fit-${theme}`,
        );
        cy.get('.screenshot-area').percySnapshot(
          `pagecomponent-page--page-layout-fit-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
