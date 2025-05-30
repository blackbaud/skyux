import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('datetime-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['12-hr', '24-hr'].forEach((mode) => {
        describe(`in ${mode} mode`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=timepickercomponent-timepicker--timepicker-${mode}`,
            ),
          );
          it('should render the component', () => {
            cy.skyReady('app-timepicker');
            cy.get('.sky-input-group-timepicker-btn')
              .last()
              .should('exist')
              .should('be.visible')
              .click();

            cy.get(
              'sky-overlay .sky-timepicker-container .sky-timepicker-footer',
            )
              .should('exist')
              .should('be.visible')
              // Move focus so the focus ring is not in the screenshot.
              .click();

            cy.get('body')
              .should('exist')
              .should('be.visible')
              .then(($body) => {
                // Verify the timepicker is open and positioned.
                const buttonBottom = Math.round(
                  $body
                    .find('[aria-expanded="true"]')
                    .get(0)
                    .getBoundingClientRect().bottom,
                );
                cy.wrap(buttonBottom).should('be.gt', 0);
                const dialogTop = Math.round(
                  $body.find('[role="dialog"]').position().top,
                );
                cy.wrap(buttonBottom).should('equal', dialogTop);
                return cy.wrap($body.get(0));
              })
              .skyVisualTest(
                `timepickercomponent-timepicker--timepicker-${mode}-${theme}`,
                {
                  overwrite: true,
                  disableTimersAndAnimations: true,
                },
              );
          });
        });
      });
    });
  });
});
