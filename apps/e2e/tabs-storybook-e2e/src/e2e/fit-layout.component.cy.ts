import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('tabs fit layout', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=fit-layoutcomponent--fit-layout`,
        ),
      );

      it('should render the tabs using fit layout', () => {
        cy.skyReady('app-fit-layout').should('exist').should('be.visible');
        cy.get('sky-tab-button:nth-child(2) [role="tab"]').click();
        cy.get('sky-tab:nth-of-type(2) [role="tabpanel"] .placeholder')
          .should('exist')
          .should('be.visible');
        cy.get('app-fit-layout').screenshot(`fit-layout-${theme}`);
        cy.get('app-fit-layout').percySnapshot(`fit-layout-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
