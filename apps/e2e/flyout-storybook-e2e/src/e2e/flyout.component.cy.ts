import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('flyout-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=flyoutcomponent-flyout--flyout`
        )
      );
      it('should render the component', () => {
        cy.get('app-flyout')
          .should('exist')
          .should('be.visible')
          .screenshot(`flyoutcomponent-flyout--flyout-${theme}`)
          .percySnapshot(`flyoutcomponent-flyout--flyout-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
