import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 800);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=inputscomponent-inputs--inputs`
        );
      });
      it('should render the component', () => {
        cy.get('app-inputs')
          .should('exist')
          .should('be.visible')
          .end()
          .document()
          .screenshot(`inputscomponent-inputs--inputs-${theme}`)
          .percySnapshot(`inputscomponent-inputs--inputs-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
