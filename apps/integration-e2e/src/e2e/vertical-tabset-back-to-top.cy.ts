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
            });

            it('verify back-to-top button', () => {
              /* spell-checker:disable */
              if (device === 'iphone-6') {
                cy.get('.sky-vertical-tabset-content button')
                  .should('be.visible')
                  .should('contain', 'Tab list')
                  .click();
              }
              cy.get('#sky-vertical-tab-1')
                .should('be.visible')
                .should('contain', 'Group 1 Tab 1')
                .click();
              cy.get(
                'div[aria-labelledby="sky-vertical-tab-1"] > div:first-child'
              )
                .should('be.visible')
                .should('contain', 'Group 1 Tab 1 content')
                .scrollTo('bottom');
              cy.get('sky-back-to-top button')
                .should('be.visible')
                .should('contain', 'Back to top');
            });
          });
        }
      );
    });
  });
});
