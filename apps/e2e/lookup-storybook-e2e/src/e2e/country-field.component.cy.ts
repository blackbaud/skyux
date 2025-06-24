import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['empty', 'disabled', 'prepopulated', 'disabled-prepopulated'].forEach(
        (mode) => {
          describe(`in ${mode} country field`, () => {
            beforeEach(() =>
              cy.visit(
                `/iframe.html?globals=theme:${theme}&id=countryfieldcomponent-countryfield--${mode}-country-field`,
              ),
            );

            it('should render the component', () => {
              cy.skyReady('app-country-field').screenshot(
                `countryfieldcomponent-countryfield--${mode}-country-field-${theme}`,
              );
              cy.get('app-country-field').percySnapshot(
                `countryfieldcomponent-countryfield--${mode}-country-field-${theme}`,
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
          `/iframe.html?globals=theme:${theme}&id=countryfieldcomponent-countryfield--empty-country-field`,
        ),
      );
      it('should render input box with focus', () => {
        cy.skyReady('app-country-field');
        cy.get('textarea').should('exist').should('be.visible').click();

        cy.get('app-country-field').screenshot(
          `countryfieldcomponent-countryfield--country-field-input-box-focus-${theme}`,
        );
        cy.get('app-country-field').percySnapshot(
          `countryfieldcomponent-countryfield--country-field-input-box-focus-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
      it('should render input dropdown', () => {
        cy.skyReady('app-country-field');
        cy.get('textarea').should('exist').should('be.visible').type('ba');

        cy.get('app-country-field').screenshot(
          `countryfieldcomponent-countryfield--country-field-dropdown-${theme}`,
        );
        cy.get('app-country-field').percySnapshot(
          `countryfieldcomponent-countryfield--country-field-dropdown-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
      it('should render input dropdown when no results', () => {
        cy.skyReady('app-country-field');
        cy.get('textarea').should('exist').should('be.visible').type('foo');

        cy.get('app-country-field').screenshot(
          `countryfieldcomponent-countryfield--country-field-dropdown-empty-${theme}`,
        );
        cy.get('app-country-field').percySnapshot(
          `countryfieldcomponent-countryfield--country-field-dropdown-empty-${theme}`,
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
        cy.get('app-country-field').focus();

        cy.get('app-country-field').screenshot(
          `countryfieldcomponent-countryfield--country-field-input-box-error-${theme}`,
        );
        cy.get('app-country-field').percySnapshot(
          `countryfieldcomponent-countryfield--country-field-input-box-error-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
