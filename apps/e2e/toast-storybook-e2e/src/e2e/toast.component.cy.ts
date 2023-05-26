import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('toast-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=toastcomponent-toast--toast`
        )
      );
      it('should render the component', () => {
        cy.get('app-toast')
          .should('exist')
          .should('be.visible')
          .screenshot(`toastcomponent-toast--toast-${theme}`)
          .percySnapshot(`toastcomponent-toast--toast-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
