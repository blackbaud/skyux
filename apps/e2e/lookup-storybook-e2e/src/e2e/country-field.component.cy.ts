import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      describe(`in country field with phone info`, () => {
        it(`should render the input dropdown`, () => {
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=countryfieldcomponent-countryfield--phone-info-country-field`
          )
            .get('#ready')
            .should('exist')
            .end();
          cy.get('app-country-field').should('exist').should('be.visible');
          cy.get('textarea')
            .should('exist')
            .should('be.visible')
            .type('ba')
            .end();

          cy.get('app-country-field')
            .screenshot(
              `countryfieldcomponent-countryfield--country-field-dropdown-with-phone-info-${theme}`
            )
            .percySnapshot(
              `countryfieldcomponent-countryfield--country-field-dropdown-with-phone-info-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              }
            );
        });
      });
      [
        'empty',
        'disabled',
        'prepopulated',
        'hide-flag-prepopulated',
        'disabled-prepopulated',
      ].forEach((mode) => {
        describe(`in ${mode} country field`, () => {
          beforeEach(() =>
            cy
              .visit(
                `/iframe.html?globals=theme:${theme}&id=countryfieldcomponent-countryfield--${mode}-country-field`
              )
              .get('#ready')
              .should('exist')
              .end()
          );

          it('should render the component', () => {
            cy.get('app-country-field')
              .should('exist')
              .should('be.visible')
              .screenshot(
                `countryfieldcomponent-countryfield--${mode}-country-field-${theme}`
              )
              .percySnapshot(
                `countryfieldcomponent-countryfield--${mode}-country-field-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                }
              );
          });
        });
      });
      beforeEach(() =>
        cy
          .visit(
            `/iframe.html?globals=theme:${theme}&id=countryfieldcomponent-countryfield--empty-country-field`
          )
          .get('#ready')
          .should('exist')
          .end()
      );
      it('should render input box with focus', () => {
        cy.get('app-country-field').should('exist').should('be.visible');
        cy.get('textarea').should('exist').should('be.visible').click().end();

        cy.get('app-country-field')
          .screenshot(
            `countryfieldcomponent-countryfield--country-field-input-box-focus-${theme}`
          )
          .percySnapshot(
            `countryfieldcomponent-countryfield--country-field-input-box-focus-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
      it('should render input dropdown', () => {
        cy.get('app-country-field').should('exist').should('be.visible');
        cy.get('textarea')
          .should('exist')
          .should('be.visible')
          .type('ba')
          .end();

        cy.get('app-country-field')
          .screenshot(
            `countryfieldcomponent-countryfield--country-field-dropdown-${theme}`
          )
          .percySnapshot(
            `countryfieldcomponent-countryfield--country-field-dropdown-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
      it('should render input dropdown when no results', () => {
        cy.get('app-country-field').should('exist').should('be.visible');
        cy.get('textarea')
          .should('exist')
          .should('be.visible')
          .type('foo')
          .end();

        cy.get('app-country-field')
          .screenshot(
            `countryfieldcomponent-countryfield--country-field-dropdown-empty-${theme}`
          )
          .percySnapshot(
            `countryfieldcomponent-countryfield--country-field-dropdown-empty-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
      it('should render input box with error', () => {
        cy.get('app-country-field').should('exist').should('be.visible');
        cy.get('textarea').should('exist').should('be.visible').click().end();
        cy.get('textarea').focus().blur().end();

        cy.get('app-country-field')
          .screenshot(
            `countryfieldcomponent-countryfield--country-field-input-box-error-${theme}`
          )
          .percySnapshot(
            `countryfieldcomponent-countryfield--country-field-input-box-error-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
