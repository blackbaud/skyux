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
            `aggridstoriescomponent-aggridstories--ag-grid-stories-${theme}`,
            {
              clip: { x: 0, y: 0, width: 1300, height: 600 },
            }
          )
          .percySnapshot(
            `aggridstoriescomponent-aggridstories--ag-grid-stories-${theme}`,
            {
              widths: [1280],
              scope: '#root',
              percyCSS: `
                /* Avoid "virtual rows" in the screenshot. */
                #root {
                  height: 600px;
                }
              `,
            }
          );
      });
    });
  });
});
