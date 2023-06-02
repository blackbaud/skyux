import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook - expansion indicator', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=expansionindicatorcomponent-expansionindicator--expansion-indicator`
        )
      );
      it('should render the component', () => {
        cy.get('app-expansion-indicator')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `expansionindicatorcomponent-expansionindicator--expansion-indicator-${theme}`
          )
          .percySnapshot(
            `expansionindicatorcomponent-expansionindicator--expansion-indicator-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
