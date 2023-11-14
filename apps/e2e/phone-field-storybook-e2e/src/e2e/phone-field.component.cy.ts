import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('phone-field-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(600, 1300)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=phonefieldcomponent-phonefield--phone-field`,
          ),
      );
      it('should render the component', () => {
        cy.get('app-phone-field').should('exist').should('be.visible');

        if (theme === 'default') {
          cy.get('.sky-input-box-input-group-inner')
            .eq(2)
            .invoke('addClass', 'sky-field-status-active')
            .should('exist')
            .should('be.visible');
        } else {
          cy.get('.sky-input-box-group-form-control')
            .eq(2)
            .invoke('addClass', 'sky-input-box-group-form-control-focus')
            .should('exist')
            .should('be.visible');
        }

        cy.get('.sky-phone-field-country-btn')
          .eq(4)
          .should('exist')
          .should('be.visible')
          .click()
          .end();

        cy.get('.sky-phone-field-country-btn')
          .eq(5)
          .should('exist')
          .should('be.visible')
          .type('Ar')
          .end();

        cy.get('app-phone-field')
          .should('exist')
          .should('be.visible')
          .skyVisualTest(
            `phonefieldcomponent-phonefield--phone-field-${theme}`,
            {
              capture: 'fullPage',
              overwrite: true,
            },
          );
      });
    });
  });
});
