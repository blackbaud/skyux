import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=helpinlinecomponent-helpinline--help-inline`
        )
      );
      it('should render the component', () => {
        cy.get('app-help-inline')
          .should('exist')
          .should('be.visible')
          .screenshot(`helpinlinecomponent-helpinline--help-inline-${theme}`)
          .percySnapshot(
            `helpinlinecomponent-helpinline--help-inline-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
