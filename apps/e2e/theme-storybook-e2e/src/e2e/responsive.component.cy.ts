import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=responsivecomponent-responsive--responsive`
        )
      );
      it('should render the component', () => {
        cy.get('#containers')
          .should('exist')
          .should('be.visible')
          .screenshot(`responsivecomponent-responsive--responsive-${theme}`)
          .percySnapshot(
            `responsivecomponent-responsive--responsive-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#containers',
            }
          );
      });
    });
  });
});
