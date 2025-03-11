import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('navbar-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(1280, 400)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=navbarcomponent-navbar--navbar`,
          ),
      );
      it('should render the component', () => {
        cy.skyReady('app-navbar').get('.sky-dropdown-button').first().click();

        cy.get('body').screenshot(`navbarcomponent-navbar--navbar-${theme}`);
        cy.get('body').percySnapshot(
          `navbarcomponent-navbar--navbar-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
