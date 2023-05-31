import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('toast-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=toastcomponent-toast--toast`
        )
      );

      it('should render the components when only a message is used ', () => {
        cy.get('app-toast')
          .should('exist')
          .should('be.visible')
          .get('#default-trigger')
          .click()
          .get('.sky-toaster')
          .screenshot(`toastcomponent-toast--toast-${theme}`)
          .percySnapshot(`toastcomponent-toast--toast-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });

      it('should render the components when a custom component is used', () => {
        cy.get('app-toast')
          .should('exist')
          .should('be.visible')
          .get('#custom-trigger')
          .click()
          .get('.sky-toaster')
          .screenshot(`toastcomponent-toast--toast-custom-${theme}`)
          .percySnapshot(`toastcomponent-toast--toast-custom-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
