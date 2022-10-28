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

          // Verify that fonts are loaded.
          .waitForFaAndBbFonts()

          // The component has actions in ngAfterViewInit that scroll a grid to show back-to-top as well as activate a
          // validation popover. These assertions verify those have happened.

          // Expect back to top button to be visible.
          .get('.sky-back-to-top')
          .should('exist')
          .should('be.visible')
          .end()

          // Expect the validation message to be visible.
          .get('.sky-overlay sky-popover-content .sky-popover-body')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Expected a number between 1 and 18.')
          .end()

          .get('#root')
          .should('exist')
          .should('be.visible')
          .skyVisualTest(
            `aggridstoriescomponent-aggridstories--ag-grid-stories-${theme}`,
            {
              overwrite: true,
              disableTimersAndAnimations: true,
            }
          );
      });
    });
  });
});
