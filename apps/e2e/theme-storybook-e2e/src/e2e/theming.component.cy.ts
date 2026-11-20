import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=themingcomponent-theming--theming`,
        );
      });
      it('should render the component', () => {
        const themeName = String(theme.split('-').shift());
        cy.skyReady('app-theming')
          .contains(
            `${themeName.charAt(0).toUpperCase()}${themeName.slice(1)} Theme Element`,
          )
          .should('exist')
          .should('be.visible')
          .end()
          .get('app-theming')
          .contains(
            `On-push ${theme.split('-').shift()} theme conditional element`,
          )
          .should('exist')
          .should('be.visible')
          .end()
          .document()
          .screenshot(`themingcomponent-theming--theming-${theme}`);
        cy.document().percySnapshot(
          `themingcomponent-theming--theming-${theme}`,
          {
            widths: E2eVariations.MOBILE_WIDTHS,
          },
        );
      });
    });
  });
});
