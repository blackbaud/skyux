import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`modals-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=confirmcomponent-confirm--confirm`,
        ),
      );
      it('should render the OK component', () => {
        cy.skyReady('app-confirm')
          .get('.open-ok-confirm-btn')
          .should('exist')
          .should('be.visible')
          .click();
        cy.get('.sky-modal')
          .should('exist')
          .should('be.visible')
          .screenshot(`confirmcomponent-confirm--confirm-ok-${theme}`);
        cy.get('.sky-modal').percySnapshot(
          `confirmcomponent-confirm--confirm-ok-${theme}`,
        );
      });

      it('should render the Custom component', () => {
        cy.skyReady('app-confirm')
          .get('.open-custom-confirm-btn')
          .should('exist')
          .should('be.visible')
          .click();
        cy.get('.sky-modal')
          .should('exist')
          .should('be.visible')
          .screenshot(`confirmcomponent-confirm--confirm-custom-${theme}`);
        cy.get('.sky-modal').percySnapshot(
          `confirmcomponent-confirm--confirm-custom-${theme}`,
        );
      });
    });
  });
});
