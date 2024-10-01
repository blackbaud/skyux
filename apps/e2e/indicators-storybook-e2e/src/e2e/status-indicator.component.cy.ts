import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=statusindicatorcomponent-statusindicator--status-indicator`,
        ),
      );
      it('should render the component', () => {
        cy.get('app-status-indicator')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `statusindicatorcomponent-statusindicator--status-indicator-${theme}`,
          );
        cy.get('app-status-indicator').percySnapshot(
          `statusindicatorcomponent-statusindicator--status-indicator-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  }, true);
});
