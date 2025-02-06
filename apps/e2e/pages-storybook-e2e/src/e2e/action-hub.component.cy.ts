import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`pages-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=actionhubcomponent-actionhub--action-hub`,
        ),
      );
      it('should render the component', () => {
        cy.get('app-action-hub').should('exist').should('be.visible');
        cy.window().screenshot(
          `actionhubcomponent-actionhub--action-hub-${theme}`,
        );
        cy.window().percySnapshot(
          `actionhubcomponent-actionhub--action-hub-${theme}`,
        );
      });
    });
  }, true);
});
