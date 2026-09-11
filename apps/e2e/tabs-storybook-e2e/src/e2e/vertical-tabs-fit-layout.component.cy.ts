import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('vertical tabs fit layout', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=vertical-tabs-fit-layoutcomponent--vertical-tabs-fit-layout`,
        ),
      );

      it('should render the vertical tabs using fit layout', () => {
        cy.skyReady('app-vertical-tabs-fit-layout')
          .should('exist')
          .should('be.visible');

        // Tab 2 is active on load, so activate tab 1 first to make sure the
        // click path — and therefore the layout change — is exercised.
        cy.get('sky-vertical-tab:nth-of-type(1) .sky-vertical-tab').click();
        cy.get('sky-vertical-tab:nth-of-type(2) .sky-vertical-tab').click();

        // The active tab's content is moved out of its `sky-vertical-tab`
        // element and into the tabset's content pane, so the assertion must be
        // rooted at the content pane rather than at the tab.
        cy.get('.sky-vertical-tabset-content .placeholder-danger')
          .should('exist')
          .should('be.visible');

        cy.window().screenshot(`vertical-tabs-fit-layout-${theme}`);
        cy.window().percySnapshot(`vertical-tabs-fit-layout-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
