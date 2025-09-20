import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lists-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=filtercomponent-filter--filter`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-filter', ['#ready'])
          .end()
          .get('body')
          .screenshot(`filtercomponent-filter--filter-${theme}`);
        cy.get('body').percySnapshot(
          `filtercomponent-filter--filter-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
