import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=helpinlinecomponent-helpinline--help-inline`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-help-inline');
        cy.get('sky-help-inline').first().should('be.visible').click();
        cy.get('app-help-inline').screenshot(
          `helpinlinecomponent-helpinline--help-inline-${theme}`,
        );
        cy.get('app-help-inline').percySnapshot(
          `helpinlinecomponent-helpinline--help-inline-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
