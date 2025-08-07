import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('toast-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=toastcomponent-toast--toast`,
        ),
      );

      it('should render the components when only a message is used ', () => {
        cy.skyReady('app-toast').get('#default-trigger').click();

        cy.get('.sky-toaster').screenshot(
          `toastcomponent-toast--toast-${theme}`,
        );
        cy.get('.sky-toaster').percySnapshot(
          `toastcomponent-toast--toast-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      it('should render the components when a custom component is used', () => {
        cy.skyReady('app-toast').get('#custom-trigger').click();

        cy.get('.sky-toaster').screenshot(
          `toastcomponent-toast--toast-custom-${theme}`,
        );
        cy.get('.sky-toaster').percySnapshot(
          `toastcomponent-toast--toast-custom-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
