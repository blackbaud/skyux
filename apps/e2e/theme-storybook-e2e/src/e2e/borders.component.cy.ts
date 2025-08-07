import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=borderscomponent-borders--borders`,
        );
      });
      it('should render the component', () => {
        cy.skyReady('app-borders')
          .end()
          .document()
          .screenshot(`borderscomponent-borders--borders-${theme}`);
        cy.document().percySnapshot(
          `borderscomponent-borders--borders-${theme}`,
          {
            widths: E2eVariations.MOBILE_WIDTHS,
          },
        );
      });
    });
  });
});
