import { E2eVariations, skyThemes } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  skyThemes();

  ['empty', 'disabled', 'prepopulated', 'disabled-prepopulated'].forEach(
    (mode) => {
      describe(`in ${mode} country field`, () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?id=countryfieldcomponent-countryfield--${mode}-country-field`,
          ),
        );

        it('should render the component', () => {
          cy.skyReady('app-country-field').screenshot(
            `countryfieldcomponent-countryfield--${mode}-country-field`,
          );
          cy.get('app-country-field').percySnapshot(
            `countryfieldcomponent-countryfield--${mode}-country-field`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
        });
      });
    },
  );
  beforeEach(() =>
    cy.visit(
      `/iframe.html?id=countryfieldcomponent-countryfield--empty-country-field`,
    ),
  );
  it('should render input box with focus', () => {
    cy.skyReady('app-country-field');
    cy.get('textarea').should('exist').should('be.visible').click();

    cy.get('app-country-field').screenshot(
      `countryfieldcomponent-countryfield--country-field-input-box-focus`,
    );
    cy.get('app-country-field').percySnapshot(
      `countryfieldcomponent-countryfield--country-field-input-box-focus`,
      {
        widths: E2eVariations.DISPLAY_WIDTHS,
      },
    );
  });
  it('should render input dropdown', () => {
    cy.skyReady('app-country-field');
    cy.get('textarea').should('exist').should('be.visible').type('ba');

    cy.get('app-country-field').screenshot(
      `countryfieldcomponent-countryfield--country-field-dropdown`,
    );
    cy.get('app-country-field').percySnapshot(
      `countryfieldcomponent-countryfield--country-field-dropdown`,
      {
        widths: E2eVariations.DISPLAY_WIDTHS,
      },
    );
  });
  it('should render input dropdown when no results', () => {
    cy.skyReady('app-country-field');
    cy.get('textarea').should('exist').should('be.visible').type('foo');

    cy.get('app-country-field').screenshot(
      `countryfieldcomponent-countryfield--country-field-dropdown-empty`,
    );
    cy.get('app-country-field').percySnapshot(
      `countryfieldcomponent-countryfield--country-field-dropdown-empty`,
      {
        widths: E2eVariations.DISPLAY_WIDTHS,
      },
    );
  });
  it('should render input box with error', () => {
    cy.skyReady('app-country-field');
    cy.get('textarea').should('exist').should('be.visible').click();
    cy.get('textarea').focus();
    cy.get('textarea').blur();
    cy.get('app-country-field sky-form-error').should('be.visible');

    cy.get('app-country-field').screenshot(
      `countryfieldcomponent-countryfield--country-field-input-box-error`,
    );
    cy.get('app-country-field').percySnapshot(
      `countryfieldcomponent-countryfield--country-field-input-box-error`,
      {
        widths: E2eVariations.DISPLAY_WIDTHS,
      },
    );
  });
});
