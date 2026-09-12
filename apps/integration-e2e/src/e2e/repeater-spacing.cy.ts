import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('repeater spacing', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 1200)
          .visit('/')
          .skyChooseTheme(theme)
          .contains('Repeater spacing')
          .should('be.visible')
          .click();
      });

      it('should adjust the vertical space above a repeater', () => {
        cy.skyReady('app-repeater-spacing');
        cy.skyVisualTest(`repeater-spacing-${theme}`, {
          disableTimersAndAnimations: true,
        });
      });
    });
  });
});
