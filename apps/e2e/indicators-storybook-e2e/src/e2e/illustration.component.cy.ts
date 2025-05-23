import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('illustration', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=illustrationcomponent-illustration`,
        ),
      );

      it('should render the component', () => {
        cy.skyReady('app-illustration').screenshot(`illustration-${theme}`);
        cy.percySnapshot(`illustration-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
