import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('repeater spacing', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      it('should adjust the vertical space above a repeater', () => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 1200)
          .visit('/')
          .skyChooseTheme(theme)
          .contains('Repeater spacing')
          .should('be.visible')
          .click();
        cy.skyReady('app-repeater-spacing');
        cy.skyVisualTest(`repeater-spacing-${theme}`, {
          disableTimersAndAnimations: true,
        });
        cy.get('a[aria-label="Link to list layout page"]').click();
        cy.get('h1').contains('List layout').should('be.visible');
        cy.skyVisualTest(`repeater-spacing-${theme}-list-layout`, {
          disableTimersAndAnimations: true,
        });
        cy.get('a[aria-label="Link to toolbar list layout page"]').click();
        cy.get('h1').contains('Toolbar list layout').should('be.visible');
        cy.skyVisualTest(`repeater-spacing-${theme}-toolbar-list-layout`, {
          disableTimersAndAnimations: true,
        });
      });

      it('should adjust the vertical space above a repeater in a modal', () => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 1200)
          .visit('/')
          .skyChooseTheme(theme)
          .contains('Repeater spacing in modal')
          .should('be.visible')
          .click();
        cy.skyReady('app-repeater-spacing');
        cy.skyVisualTest(`repeater-spacing-${theme}-modal`, {
          disableTimersAndAnimations: true,
        });
      });
    });
  });
});
