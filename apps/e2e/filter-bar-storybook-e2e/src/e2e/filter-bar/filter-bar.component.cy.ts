import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('filter-bar', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=filter-barcomponent--filter-bar`,
        ),
      );

      it('should render the component', () => {
        cy.get('app-filter-bar')
          .should('exist')
          .should('be.visible')
          .screenshot(`filter-bar-${theme}`);
        cy.percySnapshot(`filter-bar-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
