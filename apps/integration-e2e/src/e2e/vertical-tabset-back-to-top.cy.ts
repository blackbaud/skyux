import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('vertical-tabset-back-to-top', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      (['ipad-2', 'iphone-6'] as ('ipad-2' | 'iphone-6')[]).forEach(
        (device) => {
          describe(device, () => {
            beforeEach(() => {
              cy.viewport(device);
              cy.visit('/#/integrations/vertical-tabset-back-to-top');
              cy.skyChooseTheme(theme);
            });

            it('verify back-to-top button', () => {
              cy.skyReady('app-vertical-tabset-back-to-top');
              /* spell-checker:disable */
              if (device === 'iphone-6') {
                cy.get('.sky-vertical-tabset-content button')
                  .should('be.visible')
                  .should('contain', 'Tab list');
                cy.get('.sky-vertical-tabset-content button').click();
              }
              cy.get('#sky-vertical-tab-1')
                .should('be.visible')
                .should('contain', 'Group 1 Tab 1');
              cy.get('#sky-vertical-tab-1').click();
              cy.get(
                'div[aria-labelledby="sky-vertical-tab-1"] > div:first-child',
              )
                .should('be.visible')
                .should('contain', 'Group 1 Tab 1 content');
              cy.get(
                'div[aria-labelledby="sky-vertical-tab-1"] > div:first-child',
              ).scrollTo('bottom');
              cy.get('sky-back-to-top button')
                .should('be.visible')
                .should('contain', 'Back to top');
            });

            it('verify back-to-top with summary action', () => {
              cy.skyReady('app-vertical-tabset-back-to-top');

              /* spell-checker:disable */
              if (device === 'iphone-6') {
                cy.get('.sky-vertical-tabset-content button')
                  .should('be.visible')
                  .should('contain', 'Tab list');
                cy.get('.sky-vertical-tabset-content button').click();
              }
              cy.get('#sky-vertical-tab-1')
                .should('be.visible')
                .should('contain', 'Group 1 Tab 1');
              cy.get('#sky-vertical-tab-1').click();
              cy.get(
                'div[aria-labelledby="sky-vertical-tab-1"] > div:first-child',
              )
                .should('be.visible')
                .should('contain', 'Group 1 Tab 1 content');
              cy.get('button[aria-label="Toggle summary"]')
                .should('exist')
                .should('be.visible');
              cy.get('button[aria-label="Toggle summary"]')
                .first()
                .scrollIntoView();
              cy.get('button[aria-label="Toggle summary"]')
                .first()
                .click('topLeft');
              cy.get('sky-summary-action-bar button').should('be.visible');
              cy.get(
                'div[aria-labelledby="sky-vertical-tab-1"] > div:first-child',
              ).scrollTo('bottom');
              cy.get('sky-back-to-top button')
                .should('be.visible')
                .should('contain', 'Back to top');
              cy.skyVisualTest(
                `vertical-tabset-back-to-top-summary-action-${device}-${theme}`,
                { capture: 'viewport' },
              );
            });
          });
        },
      );
    });
  });
});
