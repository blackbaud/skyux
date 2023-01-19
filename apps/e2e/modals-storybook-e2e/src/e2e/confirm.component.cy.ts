import { E2eVariations } from '@skyux-sdk/e2e-schematics';

/* spell-checker:ignore confirmcomponent */
describe(`modals-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=confirmcomponent-confirm--confirm`
        )
      );
      it('should render the OK component', () => {
        cy.get('app-confirm')
          .should('exist')
          .should('be.visible')
          .get('.open-ok-confirm-btn')
          .should('exist')
          .should('be.visible')
          .click()
          .get('.sky-modal')
          .should('exist')
          .should('be.visible')
          .screenshot(`confirmcomponent-confirm--confirm-ok-${theme}`)
          .percySnapshot(`confirmcomponent-confirm--confirm-ok-${theme}`);
      });

      it('should render the Custom component', () => {
        cy.get('app-confirm')
          .should('exist')
          .should('be.visible')
          .get('.open-custom-confirm-btn')
          .should('exist')
          .should('be.visible')
          .click()
          .get('.sky-modal')
          .should('exist')
          .should('be.visible')
          .screenshot(`confirmcomponent-confirm--confirm-custom-${theme}`)
          .percySnapshot(`confirmcomponent-confirm--confirm-custom-${theme}`);
      });
    });
  });
});
