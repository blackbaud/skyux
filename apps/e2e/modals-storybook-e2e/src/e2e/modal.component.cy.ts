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
        'help-inline',
        'error',
      ]) {
        it(`should render the ${modalType} modal on desktop`, () => {
          cy.get('app-modal').should('exist').should('be.visible');
          cy.get(`.open-${modalType}-modal-btn`)
            .should('exist')
            .should('be.visible')
            .click()
            .end()
            .get('.sky-modal')
            .should('exist')
            .should('be.visible');
          if (modalType === 'full-page') {
            // Full page modals fit the viewport, which conflicts with how Cypress determines element screenshot bounds.
            cy.window()
              .screenshot(`modalcomponent-modal--${modalType}-modal-${theme}`, {
                disableTimersAndAnimations: true,
                scale: false,
                capture: 'viewport',
              })
              .percySnapshot(
                `modalcomponent-modal--${modalType}-modal-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                },
              );
          } else {
            cy.get('.sky-modal')
              .screenshot(`modalcomponent-modal--${modalType}-modal-${theme}`, {
                disableTimersAndAnimations: true,
                scale: false,
              })
              .percySnapshot(
                `modalcomponent-modal--${modalType}-modal-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                },
              );
          }
          cy.get('.sky-btn-close')
            .should('exist')
            .should('be.visible')
            .click()
            .end();
        });

        it(`should render the ${modalType} modal on mobile`, () => {
          cy.viewport('iphone-x', 'portrait');
          cy.get('app-modal').should('exist').should('be.visible');
          cy.get(`.open-${modalType}-modal-btn`)
            .should('exist')
            .should('be.visible')
            .click()
            .end()
            .get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .window()
            .screenshot(
              `modalcomponent-modal--${modalType}-modal-${theme}-mobile`,
              {
                disableTimersAndAnimations: true,
                scale: false,
              },
            )
            .percySnapshot(
              `modalcomponent-modal--${modalType}-modal-${theme}-mobile`,
              {
                widths: E2eVariations.MOBILE_WIDTHS,
              },
            )
            .get('.sky-btn-close')
            .should('exist')
            .should('be.visible')
            .click()
            .end();
        });
      }
    });
  });
});
