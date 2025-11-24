import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('data-manager-with-list-toolbars', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=data-manager-with-list-toolbarscomponent--data-manager-with-list-toolbars`,
        ),
      );

      it('should render the component', () => {
        cy.skyReady();
        cy.get('app-data-manager-with-list-toolbars')
          .should('exist')
          .should('be.visible')
          .screenshot(`data-manager-with-list-toolbars-${theme}`);
        cy.percySnapshot(`data-manager-with-list-toolbars-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
