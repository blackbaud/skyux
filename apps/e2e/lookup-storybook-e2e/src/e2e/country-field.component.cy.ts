import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      [
        'empty',
        'disabled',
        'prepopulated',
        'hide-flag-prepopulated',
        'disabled-prepopulated',
      ].forEach((mode) => {
        describe(`in ${mode} country field`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=countryfieldcomponent-countryfield--${mode}-country-field`
            )
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
    });
  });
});
