import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('errors-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=errorscomponent-errors--errors`
        )
      );
      it('should render the component', () => {
        cy.get('app-errors')
          .should('exist')
          .should('be.visible')
          .screenshot(`errorscomponent-errors--errors-${theme}`)
          .percySnapshot(`errorscomponent-errors--errors-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
