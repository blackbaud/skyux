import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook - checkbox', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=checkboxcomponent-checkbox--checkbox`,
        ),
      );

      it('should render the standard components', () => {
        cy.skyReady('app-checkbox');
        cy.get('#touched-required-checkbox').click();
        cy.get('#touched-required-checkbox').click();
        cy.get('#touched-required-checkbox input').blur();
        cy.get(
          '#touched-required-checkbox sky-form-error .sky-status-indicator-message',
        )
          .should('exist')
          .should('be.visible');
        cy.get('#touched-easy-mode-checkbox').click();
        cy.get('#touched-easy-mode-checkbox').click();
        cy.get('#touched-easy-mode-checkbox input').blur();
        cy.get(
          '#touched-easy-mode-checkbox sky-form-error .sky-status-indicator-message',
        )
          .should('exist')
          .should('be.visible');
        cy.get('app-checkbox')
          .get('#standard-checkboxes')
          .should('exist')
          .should('be.visible')
          .screenshot(`checkboxcomponent-checkbox--checkbox-${theme}-standard`);
        cy.skyVisualTest(
          `checkboxcomponent-checkbox--checkbox-${theme}-standard`,
          {
            overwrite: true,
          },
          '#standard-checkboxes',
        );
      });

      it('should render the icon components', () => {
        cy.skyReady('app-checkbox')
          .get('#icon-checkboxes')
          .should('exist')
          .should('be.visible')
          .screenshot(`checkboxcomponent-checkbox--checkbox-${theme}-icon`);
        cy.skyVisualTest(
          `checkboxcomponent-checkbox--checkbox-${theme}-icon`,
          {
            overwrite: true,
          },
          '#icon-checkboxes',
        );
      });
    });
  });
});
