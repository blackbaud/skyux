import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`ag-grid-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      const compactOptions = theme.startsWith('modern')
        ? [false, true]
        : [false];
      compactOptions.forEach((compact) => {
        it(`should render the component${compact ? ', compact' : ''}`, () => {
          cy.viewport(1300, 900).visit(
            `/iframe.html?globals=theme:${theme}&id=ag-grid--ag-grid${compact ? '-compact' : ''}`,
          );

          cy.skyReady('app-ag-grid-stories', ['#ready'])
            .end()

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

            // Expect inline help buttons to be visible in three grids.
            .get('#row-delete [col-id="name"] button.sky-help-inline')
            .should('exist')
            .should('be.visible')
            .end()

            .get('#back-to-top [col-id="name"] button.sky-help-inline')
            .should('exist')
            .should('be.visible')
            .end()

            .get('#validation [col-id="name"] button.sky-help-inline')
            .should('exist')
            .should('be.visible')
            .end()

            .get('#storybook-root')
            .should('exist')
            .should('be.visible')
            .skyVisualTest(
              /* eslint-disable-next-line @cspell/spellchecker */
              `aggridstoriescomponent-aggridstories--ag-grid-stories-${theme}${compact ? '-compact' : ''}`,
              {
                overwrite: true,
                disableTimersAndAnimations: true,
              },
            );
        });
      });
    });
  }, true);
});
