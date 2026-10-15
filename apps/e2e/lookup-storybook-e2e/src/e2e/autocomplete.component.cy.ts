import { E2eVariations, skyThemes } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  skyThemes();

  beforeEach(() => {
    cy.visit(
      `/iframe.html?id=autocompletecomponent-autocomplete--autocomplete`,
    );
    cy.viewport(1300, 900);
  });

  it('should render the component', () => {
    cy.skyReady('app-autocomplete').screenshot(
      `autocompletecomponent-autocomplete--autocomplete`,
    );
    cy.get('app-autocomplete').percySnapshot(
      `autocompletecomponent-autocomplete--autocomplete`,
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
      .screenshot(`autocompletecomponent-autocomplete--autocomplete-dropdown`);
    cy.get('app-autocomplete').percySnapshot(
      `autocompletecomponent-autocomplete--autocomplete-dropdown`,
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
      `autocompletecomponent-autocomplete--autocomplete-selected`,
    );
    cy.get('app-autocomplete').percySnapshot(
      `autocompletecomponent-autocomplete--autocomplete-seleted`,
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
        `autocompletecomponent-autocomplete--autocomplete-no-results`,
      );
    cy.get('app-autocomplete').percySnapshot(
      `autocompletecomponent-autocomplete--autocomplete-no-results`,
      {
        minHeight: 900,
        widths: E2eVariations.DISPLAY_WIDTHS,
      },
    );
  });
});
