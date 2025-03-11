import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=backtotopcomponent-backtotop--back-to-top`,
        );
        cy.viewport(1300, 200);
      });
      it('should render the component', () => {
        cy.skyReady('app-back-to-top');

        cy.scrollTo('bottom');

        cy.get('.sky-back-to-top')
          .should('exist')
          .should('be.visible')
          .get('app-back-to-top')
          .should('exist')
          .should('be.visible')
          .screenshot(`backtotopcomponent-backtotop--back-to-top-${theme}`);
        cy.get('app-back-to-top').percySnapshot(
          `backtotopcomponent-backtotop--back-to-top-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
