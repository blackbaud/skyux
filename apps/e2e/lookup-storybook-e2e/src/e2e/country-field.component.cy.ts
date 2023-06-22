import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=countryfieldcomponent-countryfield--country-field`
        )
      );
      it('should render the component', () => {
        cy.get('app-country-field')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `countryfieldcomponent-countryfield--country-field-${theme}`
          )
          .percySnapshot(
            `countryfieldcomponent-countryfield--country-field-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
