import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('modals-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=modalcomponent-modal--modal`
        )
      );
      for (const x of [
        'small',
        'medium',
        'large',
        'full-page',
        'help-inline',
      ]) {
        it(`should render the ${x} modal on desktop`, () => {
          cy.get('app-modal').should('exist').should('be.visible');
          cy.get(`.open-${x}-modal-btn`)
            .should('exist')
            .should('be.visible')
            .click()
            .end()
            .get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .screenshot(`modalcomponent-modal--${x}-modal-${theme}`, {
              disableTimersAndAnimations: true,
              scale: false,
            })
            .percySnapshot(`modalcomponent-modal--${x}-modal-${theme}`, {
              widths: E2eVariations.DISPLAY_WIDTHS,
            })
            .get('.sky-btn-close')
            .should('exist')
            .should('be.visible')
            .click()
            .end();
        });
        it(`should render the ${x} modal on mobile`, () => {
          cy.viewport('iphone-x', 'portrait');
          cy.get('app-modal').should('exist').should('be.visible');
          cy.get(`.open-${x}-modal-btn`)
            .should('exist')
            .should('be.visible')
            .click()
            .end()
            .get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .window()
            .screenshot(`modalcomponent-modal--${x}-modal-${theme}-mobile`, {
              disableTimersAndAnimations: true,
              scale: false,
            })
            .percySnapshot(`modalcomponent-modal--${x}-modal-${theme}-mobile`, {
              widths: E2eVariations.MOBILE_WIDTHS,
            })
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
