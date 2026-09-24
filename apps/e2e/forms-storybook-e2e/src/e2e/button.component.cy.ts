import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook - button', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 800);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=buttoncomponent-button--button`,
        );
      });
      it('should render the component', () => {
        cy.skyReady('app-buttons')
          .end()
          .document()
          .screenshot(`buttoncomponent-button--button-${theme}`);
        cy.document().percySnapshot(`buttoncomponent-button--button-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
