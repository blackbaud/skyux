import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=buttonscomponent-buttons--buttons`
        )
      );
      it('should render the component', () => {
        cy.get('app-buttons')
          .should('exist')
          .should('be.visible')
          .screenshot(`buttonscomponent-buttons--buttons-${theme}`)
          .percySnapshot(`buttonscomponent-buttons--buttons-${theme}`, {
            widths: E2eVariations.MOBILE_WIDTHS,
          });
      });
    });
  });
});
