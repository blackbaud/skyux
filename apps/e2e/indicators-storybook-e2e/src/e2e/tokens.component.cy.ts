import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=tokenscomponent-tokens--tokens`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-tokens')
          // Capture the focus style of the first token.
          .get(
            'sky-tokens:first-child sky-token:first-child .sky-token-btn-action',
          )
          .click();
        cy.get('app-tokens').screenshot(
          `tokenscomponent-tokens--tokens-${theme}`,
        );
        cy.get('app-tokens').percySnapshot(
          `tokenscomponent-tokens--tokens-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
