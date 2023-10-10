import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup in modal', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 1200)
          .visit('/')
          .skyChooseTheme(theme)
          .contains('Lookup in Modal')
          .should('be.visible')
          .click();
      });

      it('should affix autocomplete to the bottom of the input when the body has top margin', () => {
        // const expectedPosition: Record<
        //   E2EVariationName,
        //   { top: string; left: string }
        // > = {
        //   default: {
        //     top: '324.172px',
        //     left: '507px',
        //   },
        //   'modern-light': {
        //     top: '384.203px',
        //     left: '521px',
        //   },
        //   'modern-dark': {
        //     top: '384.203px',
        //     left: '521px',
        //   },
        // };
        cy.get('#ready')
          .should('exist')
          .end()
          .get('textarea[placeholder="Type a person\'s name..."]')
          .should('exist')
          .should('be.visible')
          .click()
          .end()
          .get(
            '.sky-autocomplete-results-container .sky-autocomplete-action-more'
          )
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Show all 21')
          .end()
          .get('.sky-autocomplete-results-container')
          .then((container) => container.get(0).getBoundingClientRect().top)
          .then((top) => {
            cy.get('textarea[placeholder="Type a person\'s name..."]')
              .then(($el) => $el.get(0).getBoundingClientRect().bottom)
              .then((inputBottom) => {
                expect(top).to.be.gte(inputBottom);
                // Allow for some margin of error in the position, specifically for headless Chrome.
                expect(top).to.be.lte(inputBottom + 6);
              });
          });
        cy.window().skyVisualTest(`lookup-in-modal-${theme}`, {
          capture: 'viewport',
          disableTimersAndAnimations: true,
        });
      });
    });
  });
});
