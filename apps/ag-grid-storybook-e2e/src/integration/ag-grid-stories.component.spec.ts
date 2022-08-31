import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`ag-grid-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(1300, 900).visit(
          `/iframe.html?globals=theme:${theme}&id=aggridstoriescomponent-aggridstories--ag-grid`
        );
        cy.waitForBlackbaudSans();
      });

      it('should render the component', () => {
        cy.get('#ready')
          .should('exist')
          .end()
          .get('#root')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `aggridstoriescomponent-aggridstories--ag-grid-stories-${theme}`
          )
          .percySnapshot(
            `aggridstoriescomponent-aggridstories--ag-grid-stories-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#root',
              percyCSS: `
              /* Avoid "virtual rows" in the screenshot. */
              :root {
                --viewport-height: 600px;
              }
            `,
            }
          );
      });
    });
  });
});
