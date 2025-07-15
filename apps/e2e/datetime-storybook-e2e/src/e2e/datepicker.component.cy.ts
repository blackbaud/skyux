import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Date picker', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=datepickercomponent-datepicker--datepicker`,
        );

        cy.skyReady('app-datepicker').end();
      });

      it('should show day picker', () => {
        cy.get('.sky-datepicker-calendar-table-container').blur({
          force: true,
        });

        cy.get('#screenshot-datepicker-calendar').skyVisualTest(
          `datepicker-day-picker-${theme}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          },
        );
      });

      it('should show month picker', () => {
        cy.get(
          '#screenshot-datepicker-calendar .sky-datepicker-calendar-title',
        ).click();

        cy.get(
          '#screenshot-datepicker-calendar .sky-datepicker-calendar-title',
        ).blur();

        cy.get('#screenshot-datepicker-calendar .sky-datepicker-calendar-title')
          .invoke('text')
          .should('match', /^\d{4}$/);

        cy.get('#screenshot-datepicker-calendar').skyVisualTest(
          `datepicker-month-picker-${theme}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          },
        );
      });

      it('should show year picker', () => {
        cy.get(
          '#screenshot-datepicker-calendar .sky-datepicker-calendar-title',
        ).click();

        cy.get('#screenshot-datepicker-calendar .sky-datepicker-calendar-title')
          .invoke('text')
          .should('match', /^\d{4}$/);

        cy.get(
          '#screenshot-datepicker-calendar .sky-datepicker-calendar-title',
        ).click();

        cy.get('#screenshot-datepicker-calendar .sky-datepicker-calendar-title')
          .invoke('text')
          .should('match', /^\d{4} - \d{4}$/);

        cy.get('#screenshot-datepicker-calendar').skyVisualTest(
          `datepicker-year-picker-${theme}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          },
        );
      });

      it('should show datepicker input when open', () => {
        cy.get('#screenshot-datepicker')
          .should('exist')
          .should('be.visible')
          .then(($datepicker) => {
            cy.window().scrollTo(0, $datepicker.position().top);
          });

        cy.get('#set-value-button').click();

        cy.get('#screenshot-datepicker .sky-datepicker button').click();

        cy.get('body')
          .should('exist')
          .should('be.visible')
          .then(($body) => {
            // Verify the datepicker calendar is open and positioned.
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
          });

        cy.get('#screenshot-datepicker').skyVisualTest(
          `datepicker-input-open-${theme}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          },
        );
      });

      it('should show datepicker input when invalid', () => {
        cy.get('#button-set-invalid-value').scrollIntoView();
        cy.get('#button-set-invalid-value').click();

        cy.get('#screenshot-datepicker').scrollIntoView();
        cy.get('#screenshot-datepicker').skyVisualTest(
          `datepicker-input-invalid-${theme}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          },
        );
      });

      it('should show datepicker input', () => {
        cy.get('#toggle-disabled-btn').scrollIntoView();

        cy.get('#screenshot-datepicker-input-box').skyVisualTest(
          `datepicker-input-box-${theme}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          },
        );
      });

      it('should show datepicker input when disabled', () => {
        cy.get('#toggle-disabled-btn').scrollIntoView();
        cy.get('#toggle-disabled-btn').click();

        cy.get(
          '#screenshot-datepicker-input-box input.sky-form-control',
        ).should('be.disabled');

        cy.get('#screenshot-datepicker-input-box').skyVisualTest(
          `datepicker-input-box-disabled-${theme}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          },
        );
      });

      it('should show datepicker input with custom dates', () => {
        cy.get('#button-set-custom-dates').scrollIntoView();
        cy.get('#button-set-custom-dates').click();

        cy.get('#set-value-button').click();

        cy.get('#sky-datepicker-button-2').click();

        cy.get('body > sky-overlay sky-wait .sky-wait-mask-loading-blocking', {
          timeout: 10000,
        })
          .should('not.exist')
          .end()
          .get('#screenshot-datepicker-input-box')
          .skyVisualTest(`datepicker-input-custom-dates-${theme}`, {
            overwrite: true,
            disableTimersAndAnimations: true,
          });
      });
    });
  });
});
