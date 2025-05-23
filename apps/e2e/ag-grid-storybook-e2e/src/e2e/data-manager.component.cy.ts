import { E2eVariations } from '@skyux-sdk/e2e-schematics';

// This is to mitigate a Cypress issue (https://github.com/cypress-io/cypress/issues/20341) where a ResizeObserver exception is thrown.
Cypress.on(
  'uncaught:exception',
  (err) =>
    !err.message.includes(
      'ResizeObserver loop completed with undelivered notifications.',
    ),
);

describe(`ag-grid-storybook data manager`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      const compactOptions = theme.startsWith('modern')
        ? [false, true]
        : [false];
      compactOptions.forEach((compact) => {
        [
          ['normal', 'normal'],
          ['normal-with-top-scroll', 'normal with top scroll'],
          ['auto-height', 'auto height'],
          ['auto-height-with-top-scroll', 'auto height with top scroll'],
          ['wrap-text', 'wrap text'],
          ['wrap-text-no-select', 'wrap text, no select checkbox'],
        ].forEach(([domLayout, label]) => {
          describe(`${label} layout${compact ? ', compact' : ''}`, () => {
            beforeEach(() => {
              cy.viewport(1300, 900).visit(
                /* spell-checker:disable-next-line */
                `/iframe.html?globals=theme:${theme}&id=datamanagercomponent-datamanager--data-manager-${domLayout}${compact ? '-compact' : ''}`,
              );
            });

            it(`should render ag-grid with data manager, ${label} layout${compact ? ', compact' : ''}`, () => {
              cy.skyReady('app-data-manager', ['#ready'])
                .end()
                .get('#storybook-root')
                .should('exist')
                .should('be.visible');

              if (!domLayout.includes('no-select')) {
                // Verify that the checkboxes are visible.
                cy.get(
                  '.ag-viewport.ag-center-cols-viewport .sky-ag-grid-cell-row-selector',
                )
                  .should('have.length.gt', 14)
                  .should('have.descendants', '.sky-switch-control');
              }

              // Verify that the first cell is focused.
              cy.get('div[row-index="0"] div[col-id="name"] a').should(
                'be.focused',
              );

              cy.get('#storybook-root').skyVisualTest(
                /* spell-checker:disable-next-line */
                `datamanagercomponent-datamanager--data-manager-${domLayout}-${theme}${compact ? '-compact' : ''}`,
                {
                  clip: { x: 0, y: 0, width: 1280, height: 600 },
                  overwrite: true,
                  disableTimersAndAnimations: true,
                },
              );
            });
          });
        });

        it(`should render data manager column picker${compact ? ', compact' : ''}`, () => {
          cy.viewport(1300, 900).visit(
            /* spell-checker:disable-next-line */
            `/iframe.html?globals=theme:${theme}&id=datamanagercomponent-datamanager--data-manager-normal${compact ? '-compact' : ''}`,
          );

          cy.skyReady('app-data-manager', ['#ready', '#storybook-root']).end();

          // Necessary to wait for the grid to render.
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(1000).get('.sky-col-picker-btn').click();

          cy.get('sky-modal-header')
            .should('exist')
            .should('be.visible')
            .click();

          cy.window().skyVisualTest(
            /* spell-checker:disable-next-line */
            `datamanagercomponent-datamanager--data-manager-column-picker-${theme}${compact ? '-compact' : ''}`,
            {
              clip: { x: 0, y: 0, width: 1280, height: 900 },
              overwrite: true,
              disableTimersAndAnimations: true,
            },
          );
        });
      });
    });
  }, true);
});
