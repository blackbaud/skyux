import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 800);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=buttonscomponent-buttons--buttons`,
        );
      });
      it('should render the component', () => {
        cy.skyReady('app-buttons')
          .end()
          .document()
          .screenshot(`buttonscomponent-buttons--buttons-${theme}`);
        cy.document().percySnapshot(
          `buttonscomponent-buttons--buttons-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
