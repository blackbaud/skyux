import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('datetime-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=timepickercomponent-timepicker--timepicker`
        )
      );
      it('should render the component', () => {
        cy.get('.sky-input-group-timepicker-btn')
          .last()
          .should('exist')
          .should('be.visible')
          .click()
          .end()
          .get('body')
          .should('exist')
          .should('be.visible')
          .skyVisualTest(
            `timepickercomponent-timepicker--timepicker-${theme}`,
            {
              overwrite: true,
              disableTimersAndAnimations: true,
            }
          );
      });
    });
  });
});
