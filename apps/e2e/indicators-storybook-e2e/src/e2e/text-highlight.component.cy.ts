import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook - text-highlight', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=texthighlightcomponent-texthighlight--text-highlight`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-text-highlight').screenshot(
          `texthighlightcomponent-texthighlight--text-highlight-${theme}`,
        );
        cy.get('app-text-highlight').percySnapshot(
          `texthighlightcomponent-texthighlight--text-highlight-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
