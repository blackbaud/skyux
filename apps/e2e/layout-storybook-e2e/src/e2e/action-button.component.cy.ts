import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook - action button', () => {
  E2eVariations.forEachTheme((theme) => {
    const screenshotPrefix = `actionbuttoncomponent-actionbutton--action-button-${theme}`;

    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=actionbuttoncomponent-actionbutton--action-button`,
        ),
      );
      it('should render the component on desktop', () => {
        cy.get('#ready').should('exist');
        cy.get('app-action-button')
          .should('exist')
          .should('be.visible')
          .screenshot(screenshotPrefix);
        cy.get('app-action-button').percySnapshot(screenshotPrefix, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });

      it('should render in a medium modal', () => {
        const screenshotName = `${screenshotPrefix}-modal`;

        cy.get('#ready').should('exist');
        cy.get('app-action-button')
          .should('exist')
          .should('be.visible')
          .get('.action-button-open-modal')
          .should('exist')
          .should('be.visible')
          .click();

        cy.get('.sky-modal')
          .should('exist')
          .should('be.visible')
          .screenshot(screenshotName, {
            disableTimersAndAnimations: true,
            scale: false,
          });
        cy.get('.sky-modal').percySnapshot(screenshotName, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });

      it('should render the component on mobile', () => {
        const screenshotName = `${screenshotPrefix}-mobile`;

        cy.get('#ready').should('exist');
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.get('app-action-button')
          .should('exist')
          .should('be.visible')
          .screenshot(screenshotName);
        cy.get('app-action-button').percySnapshot(screenshotName, {
          widths: E2eVariations.MOBILE_WIDTHS,
        });
      });
    });
  });
});
