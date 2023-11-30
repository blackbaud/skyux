import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('progress-indicator-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=progressindicatorcomponent-progressindicator--progress-indicator`
        )
      );
      it('should render the component', () => {
        cy.get('app-progress-indicator')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `progressindicatorcomponent-progressindicator--progress-indicator-${theme}`
          )
          .percySnapshot(
            `progressindicatorcomponent-progressindicator--progress-indicator-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
