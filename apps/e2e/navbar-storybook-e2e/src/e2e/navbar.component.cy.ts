import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('navbar-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=navbarcomponent-navbar--navbar`
        )
      );
      it('should render the component', () => {
        cy.get('app-navbar')
          .should('exist')
          .should('be.visible')
          .screenshot(`navbarcomponent-navbar--navbar-${theme}`)
          .percySnapshot(`navbarcomponent-navbar--navbar-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
