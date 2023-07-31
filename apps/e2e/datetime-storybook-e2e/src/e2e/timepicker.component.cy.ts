import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('datetime-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['12-hr', '24-hr'].forEach((mode) => {
        describe(`in ${mode} mode`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=timepickercomponent-timepicker--timepicker-${mode}`
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
                `timepickercomponent-timepicker--timepicker-${mode}-${theme}`,
                {
                  overwrite: true,
                  disableTimersAndAnimations: true,
                }
              );
          });
        });
      });
    });
  });
});
