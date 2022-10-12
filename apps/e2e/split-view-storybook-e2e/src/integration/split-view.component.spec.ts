import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('split-view-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=splitviewcomponent-splitview--split-view`
        )
      );
      it('should fill the page when dock is set to fill', () => {
        cy.get('.sky-split-view')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `splitviewcomponent-splitview--split-view-dock-fill-${theme}`
          )
          .percySnapshot(
            `splitviewcomponent-splitview--split-view-dock-fill-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
