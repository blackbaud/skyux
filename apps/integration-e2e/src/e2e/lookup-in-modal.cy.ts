import { E2EVariationName, E2eVariations } from '@skyux-sdk/e2e-schematics';

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
        const expectedPosition: Record<
          E2EVariationName,
          { top: string; left: string }
        > = {
          default: {
            top: '299.672px',
            left: '506px',
          },
          'modern-light': {
            top: '370.078px',
            left: '521px',
          },
          'modern-dark': {
            top: '370.078px',
            left: '521px',
          },
        };
        cy.get('#ready')
          .should('exist')
          .end()
          .get('textarea[aria-labelledby="my-friends-label"]')
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
          .should('have.css', 'top', expectedPosition[theme].top)
          .should('have.css', 'left', expectedPosition[theme].left)
          .end();
        cy.window().skyVisualTest(`lookup-in-modal-${theme}`, {
          capture: 'viewport',
          disableTimersAndAnimations: true,
        });
      });
    });
  });
});
