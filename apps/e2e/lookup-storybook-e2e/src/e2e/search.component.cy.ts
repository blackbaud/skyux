import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .visit(
            `/iframe.html?globals=theme:${theme}&id=searchcomponent-search--search`,
          )
          .get('#ready')
          .should('exist')
          .end(),
      );
      it('should render the component', () => {
        cy.get('app-search')
          .should('exist')
          .should('be.visible')
          .screenshot(`searchcomponent-search--search-${theme}`);
        cy.get('app-search').percySnapshot(
          `searchcomponent-search--search-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      it('should render the component collapsed on mobile', () => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.get('app-search')
          .should('exist')
          .should('be.visible')
          .screenshot(`searchcomponent-search--search-${theme}-mobile`);
        cy.get('app-search').percySnapshot(
          `searchcomponent-search--search-${theme}-mobile`,
          {
            widths: E2eVariations.MOBILE_WIDTHS,
          },
        );
      });

      it('should render the component collapsed on mobile', () => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.get('app-search')
          .should('exist')
          .should('be.visible')
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
  }, true);
});
