import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('modals-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=modalcomponent-modal--modal`
        )
      );
      it('should render the component', () => {
        cy.get('app-modal').should('exist').should('be.visible');
        for (const x of [
          'small',
          'medium',
          'large',
          'full-page',
          'help-inline',
        ]) {
          cy.get(`.open-${x}-modal-btn`)
            .should('exist')
            .should('be.visible')
            .click()
            .get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .screenshot(`modalcomponent-modal--${x}-modal-${theme}`)
            .percySnapshot(`modalcomponent-modal--${x}-modal-${theme}`, {
              widths: E2eVariations.DISPLAY_WIDTHS,
            })
            .get('.sky-btn-close')
            .should('exist')
            .should('be.visible')
            .click();
        }
      });

      it('should render the component in mobile', () => {
        cy.viewport('iphone-x', 'portrait');
        cy.get('app-modal').should('exist').should('be.visible');
        for (const x of [
          'small',
          'medium',
          'large',
          'full-page',
          'help-inline',
        ]) {
          cy.get(`.open-${x}-modal-btn`)
            .should('exist')
            .should('be.visible')
            .click()
            .get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .screenshot(`modalcomponent-modal--${x}-modal-${theme}-mobile`)
            .percySnapshot(`modalcomponent-modal--${x}-modal-${theme}-mobile`, {
              widths: E2eVariations.MOBILE_WIDTHS,
            })
            .get('.sky-btn-close')
            .should('exist')
            .should('be.visible')
            .click();
        }
      });
    });
  });
});
