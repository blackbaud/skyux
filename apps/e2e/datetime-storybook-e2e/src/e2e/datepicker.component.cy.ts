import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Date picker', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=datepickercomponent-datepicker--datepicker`
        );
        cy.get('app-datepicker')
          .should('exist')
          .should('be.visible')
          .end()
          .get('#ready')
          .should('exist')
          .end();
      });

      it('should show day picker', () => {
        cy.get('#screenshot-datepicker').skyVisualTest(
          `datepicker-day-picker-${theme}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          }
        );
      });

      it('should show month picker', () => {
        cy.get('#screenshot-datepicker-calendar .sky-datepicker-calendar-title')
          .click()
          .end()
          .get('#screenshot-datepicker-calendar .sky-datepicker-calendar-title')
          .invoke('text')
          .should('match', /^\d{4}$/)
          .end()
          .get('#screenshot-datepicker')
          .skyVisualTest(`datepicker-month-picker-${theme}`, {
            overwrite: true,
            disableTimersAndAnimations: true,
          });
      });

      it('should show year picker', () => {
        cy.get('#screenshot-datepicker-calendar .sky-datepicker-calendar-title')
          .click()
          .end()
          .get('#screenshot-datepicker-calendar .sky-datepicker-calendar-title')
          .invoke('text')
          .should('match', /^\d{4}$/)
          .end()
          .get('#screenshot-datepicker-calendar .sky-datepicker-calendar-title')
          .click()
          .end()
          .get('#screenshot-datepicker-calendar .sky-datepicker-calendar-title')
          .invoke('text')
          .should('match', /^\d{4} - \d{4}$/)
          .end()
          .get('#screenshot-datepicker')
          .skyVisualTest(`datepicker-year-picker-${theme}`, {
            overwrite: true,
            disableTimersAndAnimations: true,
          });
      });

      it('should show datepicker input when open', () => {
        cy.get('#screenshot-datepicker')
          .should('exist')
          .should('be.visible')
          .scrollIntoView()
          .end()
          .get('#set-value-button')
          .click()
          .end()
          .get('#screenshot-datepicker .sky-datepicker button')
          .click()
          .end()
          .get('#screenshot-datepicker')
          .skyVisualTest(`datepicker-input-open-${theme}`, {
            overwrite: true,
            disableTimersAndAnimations: true,
          });
      });

      it('should show datepicker input when invalid', () => {
        cy.get('#button-set-invalid-value')
          .scrollIntoView()
          .click()
          .end()
          .get('#screenshot-datepicker')
          .scrollIntoView()
          .skyVisualTest(`datepicker-input-invalid-${theme}`, {
            overwrite: true,
            disableTimersAndAnimations: true,
          });
      });

      it('should show datepicker input', () => {
        cy.get('#toggle-disabled-btn')
          .scrollIntoView()
          .end()
          .get('#screenshot-datepicker-input-box')
          .skyVisualTest(`datepicker-input-box-${theme}`, {
            overwrite: true,
            disableTimersAndAnimations: true,
          });
      });

      it('should show datepicker input when disabled', () => {
        cy.get('#toggle-disabled-btn')
          .scrollIntoView()
          .click()
          .end()
          .get('#screenshot-datepicker-input-box input.sky-form-control')
          .should('be.disabled')
          .end()
          .get('#screenshot-datepicker-input-box')
          .skyVisualTest(`datepicker-input-box-disabled-${theme}`, {
            overwrite: true,
            disableTimersAndAnimations: true,
          });
      });

      it('should show datepicker input with custom dates', () => {
        cy.get('#button-set-custom-dates')
          .scrollIntoView()
          .click()
          .end()
          .get('#set-value-button')
          .click()
          .end()
          .get('#sky-datepicker-button-2')
          .click()
          .end()
          .get('body > sky-overlay sky-wait[ng-reflect-is-waiting="false"]', {
            timeout: 10000,
          })
          .should('exist')
          .should('not.be.visible')
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
