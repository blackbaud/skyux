import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('repeater in a box', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 1200)
          .visit('/')
          .skyChooseTheme(theme)
          .contains('Repeater in a Box')
          .should('be.visible')
          .click();
      });

      it('should adjust vertical space for a repeater in a box', () => {
        cy.skyReady('');
        cy.skyVisualTest(`repeater-in-a-box-${theme}`, {
          disableTimersAndAnimations: true,
        });
      });
    });
  });
});
