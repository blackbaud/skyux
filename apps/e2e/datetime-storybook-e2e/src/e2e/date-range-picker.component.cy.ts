import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Date range picker', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=daterangepickercomponent-daterangepicker--date-range-picker`
        );
        cy.get('app-date-range-picker')
          .should('exist')
          .should('be.visible')
          .get('#ready')
          .should('exist')
          .end();
      });
      it('should render the component', () => {
        cy.get('#form-group-rangeInvalid input')
          .first()
          .click()
          .clear()
          .type('invalid')
          .end()
          .get('#form-group-rangeInvalid input')
          .eq(1)
          .click()
          .clear()
          .type('invalid')
          .end()
          .get('#screenshot-date-range-picker > div:nth-child(8) > button')
          .should('contain.text', 'Submit')
          .click()
          .blur()
          .end()
          .get('app-date-range-picker')
          .skyVisualTest(`date-range-picker-${theme}`, {
            overwrite: true,
            disableTimersAndAnimations: true,
          });
      });
      it('should render the component on mobile', () => {
        cy.viewport('iphone-x', 'portrait');
        cy.get('#form-group-rangeInvalid input')
          .first()
          .click()
          .clear()
          .type('invalid')
          .end()
          .get('#form-group-rangeInvalid input')
          .eq(1)
          .click()
          .clear()
          .type('invalid')
          .end()
          .get('#screenshot-date-range-picker > div:nth-child(8) > button')
          .should('contain.text', 'Submit')
          .click()
          .blur()
          .end()
          .get('app-date-range-picker')
          .skyVisualTest(`date-range-picker-${theme}-mobile`, {
            overwrite: true,
            disableTimersAndAnimations: true,
          });
      });
    });
  });
});
