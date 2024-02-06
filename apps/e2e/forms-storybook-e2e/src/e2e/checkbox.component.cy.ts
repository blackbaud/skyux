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
        cy.get('app-checkbox')
          .should('exist')
          .should('be.visible')
          .get('#touched-required-checkbox')
          .dblclick()
          .get('#standard-checkboxes')
          .should('exist')
          .should('be.visible')
          .screenshot(`checkboxcomponent-checkbox--checkbox-${theme}-standard`)
          .percySnapshot(
            `checkboxcomponent-checkbox--checkbox-${theme}-standard`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#standard-checkboxes',
            },
          );
      });

      it('should render the icon components', () => {
        cy.get('app-checkbox')
          .should('exist')
          .should('be.visible')
          .get('#icon-checkboxes')
          .should('exist')
          .should('be.visible')
          .screenshot(`checkboxcomponent-checkbox--checkbox-${theme}-icon`)
          .percySnapshot(`checkboxcomponent-checkbox--checkbox-${theme}-icon`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
            scope: '#icon-checkboxes',
          });
      });
    });
  });
});
