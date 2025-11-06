import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('list-summary', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=list-summarycomponent--list-summary`,
        ),
      );

      it('should render the component', () => {
        cy.skyReady();
        cy.get('app-list-summary')
          .should('exist')
          .should('be.visible')
          .screenshot(`list-summary-${theme}`);
        cy.percySnapshot(`list-summary-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
