import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=validationcomponent-validation--validation`,
        );
      });
      it('should render the component', () => {
        cy.ready('app-validation')
          .end()
          .get('#textInputTouched')
          .should('exist')
          .should('be.visible')
          .click();

        cy.get('#selectInputTouched')
          .should('exist')
          .should('be.visible')
          .focus();

        cy.get('#free-space').should('exist').should('be.visible').click();

        cy.document().screenshot(
          `validationcomponent-validation--validation-${theme}`,
        );
        cy.document().percySnapshot(
          `validationcomponent-validation--validation-${theme}`,
          {
            widths: E2eVariations.MOBILE_WIDTHS,
          },
        );
      });
    });
  });
});
