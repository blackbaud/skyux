import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=inputscomponent-inputs--inputs`
        )
      );
      it('should render the component', () => {
        cy.get('app-inputs')
          .should('exist')
          .should('be.visible')
          .screenshot(`inputscomponent-inputs--inputs-${theme}`)
          .percySnapshot(`inputscomponent-inputs--inputs-${theme}`, {
            widths: E2eVariations.MOBILE_WIDTHS,
          });
      });
    });
  });
});
