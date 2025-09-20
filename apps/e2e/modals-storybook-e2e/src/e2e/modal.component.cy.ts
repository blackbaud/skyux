import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('modals-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=modalcomponent-modal--modal`,
        ),
      );

      for (const modalType of [
        'small',
        'medium',
        'large',
        'full-page',
        'heading-text-help-inline',
        'help-inline',
        'error',
        'positioned-background',
      ]) {
        it(`should render the ${modalType} modal on desktop`, () => {
          cy.skyReady('app-modal');
          cy.get(`.open-${modalType}-modal-btn`)
            .should('exist')
            .should('be.visible')
            .click();

          cy.get('.sky-modal').should('exist').should('be.visible');
          if (modalType === 'full-page') {
            // Full page modals fit the viewport, which conflicts with how Cypress determines element screenshot bounds.
            cy.window().screenshot(
              `modalcomponent-modal--${modalType}-modal-${theme}`,
              {
                disableTimersAndAnimations: true,
                scale: false,
                capture: 'viewport',
              },
            );
            cy.window().percySnapshot(
              `modalcomponent-modal--${modalType}-modal-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              },
            );
          } else {
            cy.get('.sky-modal').screenshot(
              `modalcomponent-modal--${modalType}-modal-${theme}`,
              {
                disableTimersAndAnimations: true,
                scale: false,
              },
            );
            cy.get('.sky-modal').percySnapshot(
              `modalcomponent-modal--${modalType}-modal-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              },
            );
          }
          cy.get('.sky-btn-close').should('exist').should('be.visible').click();
        });

        it(`should render the ${modalType} modal on mobile`, () => {
          cy.viewport('iphone-x', 'portrait');
          cy.skyReady('app-modal');
          cy.get(`.open-${modalType}-modal-btn`)
            .should('exist')
            .should('be.visible')
            .click();

          cy.get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .window()
            .screenshot(
              `modalcomponent-modal--${modalType}-modal-${theme}-mobile`,
              {
                disableTimersAndAnimations: true,
                scale: false,
              },
            );
          cy.window().percySnapshot(
            `modalcomponent-modal--${modalType}-modal-${theme}-mobile`,
            {
              widths: E2eVariations.MOBILE_WIDTHS,
            },
          );
          cy.get('.sky-btn-close').should('exist').should('be.visible').click();
        });
      }
    });
  });
});
