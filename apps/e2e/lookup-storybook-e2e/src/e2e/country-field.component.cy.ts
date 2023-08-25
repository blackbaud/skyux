import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('country field', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(1300, 900);
      });

      it(`should render country fields`, () => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=countryfieldcomponent-countryfield--country-field`
        );
        cy.get('app-country-field').should('exist').should('be.visible');
        cy.get('.ready').should('exist');

        /* spell-checker:disable-next-line */
        cy.get('[labeltext="Country field input with error"] textarea')
          .should('exist')
          .should('be.visible')
          .focus();

        cy.get('.ready').click();

        cy.get('body')
          .screenshot(`country-field-${theme}--closed`)
          .percySnapshot(`country-field-${theme}--closed`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });

        /* spell-checker:disable-next-line */
        cy.get('[labeltext="Country field input with phone info"] textarea')
          .should('exist')
          .should('be.visible')
          .type('ba')
          .end();

        cy.get('body')
          .screenshot(`country-field-${theme}--dropdown`)
          .percySnapshot(`country-field-${theme}--dropdown`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
