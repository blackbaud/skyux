import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook - expansion indicator', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=expansionindicatorcomponent-expansionindicator--expansion-indicator`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-expansion-indicator')
          .should('exist')
          .screenshot(
            `expansionindicatorcomponent-expansionindicator--expansion-indicator-${theme}`,
          );
        cy.get('app-expansion-indicator').percySnapshot(
          `expansionindicatorcomponent-expansionindicator--expansion-indicator-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
