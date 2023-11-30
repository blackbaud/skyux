import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=autocompletecomponent-autocomplete--autocomplete`
        );
        cy.viewport(1300, 900).get('#ready').should('exist').end();
      });
      it('should render the component', () => {
        cy.get('app-autocomplete')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `autocompletecomponent-autocomplete--autocomplete-${theme}`
          )
          .percySnapshot(
            `autocompletecomponent-autocomplete--autocomplete-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });

      it('should render the component with the dropdown', () => {
        cy.get('app-autocomplete')
          .should('exist')
          .should('be.visible')
          .get('.sky-form-control')
          .should('exist')
          .should('be.visible')
          .type('a')
          .get('app-autocomplete')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `autocompletecomponent-autocomplete--autocomplete-dropdown-${theme}`
          )
          .percySnapshot(
            `autocompletecomponent-autocomplete--autocomplete-dropdown-${theme}`,
            {
              minHeight: 900,
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });

      it('should render the component with a selected result', () => {
        cy.get('app-autocomplete')
          .should('exist')
          .should('be.visible')
          .get('.sky-form-control')
          .should('exist')
          .should('be.visible')
          .type('a')
          .get('.sky-autocomplete-result')
          .first()
          .click()
          .get('app-autocomplete')
          .should('exist')
          .should('be.visible')
          .click()
          .screenshot(
            `autocompletecomponent-autocomplete--autocomplete-selected-${theme}`
          )
          .percySnapshot(
            `autocompletecomponent-autocomplete--autocomplete-seleted-${theme}`,
            {
              minHeight: 900,
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });

      it('should render the component with no results', () => {
        cy.get('app-autocomplete')
          .should('exist')
          .should('be.visible')
          .get('.sky-form-control')
          .should('exist')
          .should('be.visible')
          .type('z')
          .get('app-autocomplete')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `autocompletecomponent-autocomplete--autocomplete-no-results-${theme}`
          )
          .percySnapshot(
            `autocompletecomponent-autocomplete--autocomplete-no-results-${theme}`,
            {
              minHeight: 900,
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
