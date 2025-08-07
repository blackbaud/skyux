import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=autocompletecomponent-autocomplete--autocomplete`,
        );
        cy.viewport(1300, 900);
      });

      it('should render the component', () => {
        cy.skyReady('app-autocomplete').screenshot(
          `autocompletecomponent-autocomplete--autocomplete-${theme}`,
        );
        cy.get('app-autocomplete').percySnapshot(
          `autocompletecomponent-autocomplete--autocomplete-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      it('should render the component with the dropdown', () => {
        cy.skyReady('app-autocomplete')
          .get('.sky-form-control')
          .should('exist')
          .should('be.visible')
          .type('a');
        cy.get('app-autocomplete')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `autocompletecomponent-autocomplete--autocomplete-dropdown-${theme}`,
          );
        cy.get('app-autocomplete').percySnapshot(
          `autocompletecomponent-autocomplete--autocomplete-dropdown-${theme}`,
          {
            minHeight: 900,
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      it('should render the component with a selected result', () => {
        cy.skyReady('app-autocomplete')
          .get('.sky-form-control')
          .should('exist')
          .should('be.visible')
          .type('a');
        cy.get('.sky-autocomplete-result').first().click();
        cy.get('app-autocomplete').should('exist').should('be.visible').click();
        cy.get('app-autocomplete').screenshot(
          `autocompletecomponent-autocomplete--autocomplete-selected-${theme}`,
        );
        cy.get('app-autocomplete').percySnapshot(
          `autocompletecomponent-autocomplete--autocomplete-seleted-${theme}`,
          {
            minHeight: 900,
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      it('should render the component with no results', () => {
        cy.skyReady('app-autocomplete')
          .get('.sky-form-control')
          .should('exist')
          .should('be.visible')
          .type('z');
        cy.get('app-autocomplete')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `autocompletecomponent-autocomplete--autocomplete-no-results-${theme}`,
          );
        cy.get('app-autocomplete').percySnapshot(
          `autocompletecomponent-autocomplete--autocomplete-no-results-${theme}`,
          {
            minHeight: 900,
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
