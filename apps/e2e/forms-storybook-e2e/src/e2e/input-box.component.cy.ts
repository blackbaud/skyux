import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=inputboxcomponent-inputbox--input-box`
        )
      );
      it('should render the component', () => {
        cy.get('app-input-box')
          .should('exist')
          .should('be.visible')
          .screenshot(`inputboxcomponent-inputbox--input-box-${theme}`)
          .percySnapshot(`inputboxcomponent-inputbox--input-box-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
