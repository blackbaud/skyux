import { E2eVariations } from '@skyux-sdk/e2e-schematics';

// This is to mitigate a Cypress issue (https://github.com/cypress-io/cypress/issues/20341) where a ResizeObserver exception is thrown.
Cypress.on(
  'uncaught:exception',
  (err) => !err.message.includes('ResizeObserver loop limit exceeded')
);

describe('action-bars-storybook - summary action bar', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['tab', 'page', 'split-view', 'modal', 'modal-full-page'].forEach(
        (style) => {
          // TODO: make new array with Lg and Xs widths
          E2eVariations.DISPLAY_WIDTHS.concat(
            E2eVariations.MOBILE_WIDTHS
          ).forEach((width) => {
            describe(`at ${width}px (${style})`, () => {
              it(`should render the component at width ${width} (${style})`, () => {
                cy.viewport(width, 960).visit(
                  `/iframe.html?globals=theme:${theme}&id=summaryactionbarcomponent-summaryactionbar--summary-action-bar-${style}`
                );
                cy.get('app-summary-action-bar')
                  .should('exist')
                  .should('be.visible');

                cy.get('#ready').should('exist');

                cy.get('app-summary-action-bar')
                  .should('exist')
                  .should('be.visible');

                cy.skyVisualTest(
                  `summaryactionbarcomponent-summaryactionbar--summary-action-bar-${style}-${width}-${theme}`,
                  {
                    width: width,
                    overwrite: true,
                    disableTimersAndAnimations: true,
                  }
                );
              });

              // Mobile width only/modal specific tests
              if (
                E2eVariations.MOBILE_WIDTHS.includes(width) ||
                style === 'modal'
              ) {
                it(`should render the component at width ${width} and with a collapsed summary (${style})`, () => {
                  cy.viewport(width, 960).visit(
                    `/iframe.html?globals=theme:${theme}&id=summaryactionbarcomponent-summaryactionbar--summary-action-bar-${style}`
                  );

                  cy.get('app-summary-action-bar')
                    .should('exist')
                    .should('be.visible');

                  cy.get('#ready').should('exist');

                  cy.get('.sky-summary-action-bar-details-collapse button')
                    .should('exist')
                    .should('be.visible')
                    .click();

                  if (style.startsWith('modal')) {
                    cy.get('sky-modal-content')
                      .should('exist')
                      .should('be.visible')
                      .click();
                  } else {
                    cy.get('app-summary-action-bar')
                      .should('exist')
                      .should('be.visible')
                      .click();
                  }

                  cy.skyVisualTest(
                    `summaryactionbarcomponent-summaryactionbar--summary-action-bar-${style}-${width}-${theme}-collapsed-summary`,
                    {
                      width: width,
                      overwrite: true,
                      disableTimersAndAnimations: true,
                    }
                  );
                });

                it(`should render the component at width ${width} and with and open secondary actions menu (${style})`, () => {
                  cy.viewport(width, 960).visit(
                    `/iframe.html?globals=theme:${theme}&id=summaryactionbarcomponent-summaryactionbar--summary-action-bar-${style}`
                  );

                  cy.get('app-summary-action-bar')
                    .should('exist')
                    .should('be.visible');

                  cy.get('#ready').should('exist');

                  cy.get('sky-summary-action-bar-secondary-actions button')
                    .should('exist')
                    .should('be.visible')
                    .click();

                  cy.get('app-summary-action-bar')
                    .should('exist')
                    .should('be.visible');

                  cy.skyVisualTest(
                    `summaryactionbarcomponent-summaryactionbar--summary-action-bar-${style}-${width}-${theme}-open-secondary-actions`,
                    {
                      width: width,
                      overwrite: true,
                      disableTimersAndAnimations: true,
                    }
                  );
                });
              }
            });
          });
        }
      );
    });
  });
});
