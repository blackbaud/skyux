import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lists-storybook - paging', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=pagingcomponent-paging--paging`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-paging').screenshot(
          `pagingcomponent-paging--paging-${theme}`,
        );
        cy.get('app-paging').percySnapshot(
          `pagingcomponent-paging--paging-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
