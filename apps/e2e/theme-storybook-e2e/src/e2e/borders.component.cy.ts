import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=borderscomponent-borders--borders`
        )
      );
      it('should render the component', () => {
        cy.get('app-borders')
          .should('exist')
          .should('be.visible')
          .screenshot(`borderscomponent-borders--borders-${theme}`)
          .percySnapshot(`borderscomponent-borders--borders-${theme}`, {
            widths: E2eVariations.MOBILE_WIDTHS,
          });
      });
    });
  });
});
