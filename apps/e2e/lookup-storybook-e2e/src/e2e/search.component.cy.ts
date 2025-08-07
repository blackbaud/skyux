import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=searchcomponent-search--search`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-search').screenshot(
          `searchcomponent-search--search-${theme}`,
        );
        cy.get('app-search').percySnapshot(
          `searchcomponent-search--search-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      it('should render the component collapsed on mobile', () => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.skyReady('app-search').screenshot(
          `searchcomponent-search--search-${theme}-mobile`,
        );
        cy.get('app-search').percySnapshot(
          `searchcomponent-search--search-${theme}-mobile`,
          {
            widths: E2eVariations.MOBILE_WIDTHS,
          },
        );
      });

      it('should render the component collapsed on mobile', () => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.skyReady('app-search')
          .get('#filled-search .sky-search-btn-open')
          .click();
        cy.get('#empty-search .sky-search-btn-open').click();
        cy.get('app-search').screenshot(
          `searchcomponent-search--search-${theme}-mobile-open`,
        );
        cy.get('app-search').percySnapshot(
          `searchcomponent-search--search-${theme}-mobile-open`,
          {
            widths: E2eVariations.MOBILE_WIDTHS,
          },
        );
      });
    });
  });
});
