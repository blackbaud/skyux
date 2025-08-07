import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Date range picker', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=daterangepickercomponent-daterangepicker--date-range-picker`,
        );
        cy.skyReady('app-date-range-picker').end();
      });

      it('should render the component', () => {
        cy.get('#form-group-rangeInvalid input').first().click();
        cy.get('#form-group-rangeInvalid input').first().clear();
        cy.get('#form-group-rangeInvalid input').first().type('invalid');

        cy.get('#form-group-rangeInvalid input').eq(1).click();
        cy.get('#form-group-rangeInvalid input').eq(1).clear();
        cy.get('#form-group-rangeInvalid input').eq(1).type('invalid');

        cy.get('#screenshot-date-range-picker > div:nth-child(9) > button')
          .should('contain.text', 'Submit')
          .click();
        cy.get(
          '#screenshot-date-range-picker > div:nth-child(9) > button',
        ).blur();

        cy.get('app-date-range-picker').skyVisualTest(
          `date-range-picker-${theme}`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          },
        );
      });
      it('should render the component on mobile', () => {
        cy.viewport('iphone-x', 'portrait');
        cy.get('#form-group-rangeInvalid input').first().click();
        cy.get('#form-group-rangeInvalid input').first().clear();
        cy.get('#form-group-rangeInvalid input').first().type('invalid');

        cy.get('#form-group-rangeInvalid input').eq(1).click();
        cy.get('#form-group-rangeInvalid input').eq(1).clear();
        cy.get('#form-group-rangeInvalid input').eq(1).type('invalid');

        cy.get('#screenshot-date-range-picker > div:nth-child(9) > button')
          .should('contain.text', 'Submit')
          .click();
        cy.get(
          '#screenshot-date-range-picker > div:nth-child(9) > button',
        ).blur();

        cy.get('app-date-range-picker').skyVisualTest(
          `date-range-picker-${theme}-mobile`,
          {
            overwrite: true,
            disableTimersAndAnimations: true,
          },
        );
      });
    });
  });
});
