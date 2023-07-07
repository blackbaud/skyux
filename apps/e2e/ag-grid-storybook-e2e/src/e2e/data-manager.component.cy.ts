import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`ag-grid-storybook data manager`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      [
        ['normal', 'normal'],
        ['normal-with-top-scroll', 'normal with top scroll'],
        ['auto-height', 'auto height'],
        ['auto-height-with-top-scroll', 'auto height with top scroll'],
      ].forEach(([domLayout, label]) => {
        describe(`${label} layout`, () => {
          beforeEach(() => {
            cy.viewport(1300, 900).visit(
              `/iframe.html?globals=theme:${theme}&id=datamanagercomponent-datamanager--data-manager-${domLayout}`
            );
          });

          it(`should render ag-grid with data manager, ${label} layout`, () => {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.get('#ready')
              .should('exist')
              .end()

              .get('#storybook-root')
              .should('exist')
              .should('be.visible')
              .end()
              // Verify that the checkboxes are visible.
              .get('[name="center"] .sky-ag-grid-cell-row-selector')
              .should('have.length.gt', 14)
              .should('have.descendants', '.sky-switch-control')
              .end()
              // Necessary to wait for the grid to render.
              .wait(1000)
              .get('#storybook-root')
              .skyVisualTest(
                `datamanagercomponent-datamanager--data-manager-${domLayout}-${theme}`,
                {
                  clip: { x: 0, y: 0, width: 1280, height: 600 },
                  overwrite: true,
                  disableTimersAndAnimations: true,
                }
              );
          });
        });
      });

      it('should render data manager column picker', () => {
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.viewport(1300, 900)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=datamanagercomponent-datamanager--data-manager-normal`
          )
          .get('#ready')
          .should('exist')
          .end()

          .get('#storybook-root')
          .should('exist')
          .should('be.visible')
          .end()
          // Necessary to wait for the grid to render.
          .wait(1000)
          .get('.sky-col-picker-btn')
          .click()
          .end()
          .get('sky-modal-header')
          .should('exist')
          .should('be.visible')
          .click()
          .end()
          .window()
          .skyVisualTest(
            `datamanagercomponent-datamanager--data-manager-column-picker-${theme}`,
            {
              clip: { x: 0, y: 0, width: 1280, height: 900 },
              overwrite: true,
              disableTimersAndAnimations: true,
            }
          );
      });
    });
  });
});
