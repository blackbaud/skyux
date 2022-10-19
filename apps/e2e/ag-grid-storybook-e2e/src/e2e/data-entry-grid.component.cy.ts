import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('ag-grid-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      it('should edit date and lookup fields', () => {
        cy.viewport(1300, 1200).visit(
          `/iframe.html?globals=theme:${theme}&id=dataentrygridcomponent-dataentrygrid--data-entry-grid-date-and-lookup`
        );
        cy.waitForBlackbaudSans();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('#ready')
          .should('exist')
          .end()

          // Activate a lookup field.
          .get('#editLookup div[row-id="alexape01"] > div[col-id="name"]')
          .should('be.visible')
          .click()
          .end()

          // Activate a date field without the calendar.
          .get('#editDate div[row-id="aparilu01"] > div[col-id="birthday"]')
          .should('be.visible')
          .click()
          .end()

          // Activate a date field.
          .get(
            '#editDateWithCalendar div[row-id="berrayo01"] > div[col-id="birthday"]'
          )
          .should('be.visible')
          .click()
          .end()

          // Open the calendar.
          .get(
            '#editDateWithCalendar .ag-popup-editor button[aria-label="Select date"]'
          )
          .should('be.visible')
          .click()
          .end()
          .get('.ag-custom-component-popup .sky-datepicker-btn-selected')
          .should('be.visible')
          .should('contain.text', '12')
          .end()

          // Screenshot the three grids with active editors.
          .get('#root')
          .screenshot(
            `dataentrygridcomponent-dataentrygrid--date-and-lookup-${theme}`,
            {
              overwrite: true,
              disableTimersAndAnimations: true,
            }
          )
          .window()
          .percySnapshot(
            `dataentrygridcomponent-dataentrygrid--date-and-lookup-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              devicePixelRatio: 1,
            }
          );
      });

      it('should edit lookup field, showing results', () => {
        cy.viewport(1300, 1200).visit(
          `/iframe.html?globals=theme:${theme}&id=dataentrygridcomponent-dataentrygrid--data-entry-grid-edit-lookup`
        );
        cy.waitForBlackbaudSans();
        // Briefly wait between arrowing down.
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('#ready')
          .should('exist')
          .end()

          // Activate a text field.
          .get('#editText div[row-id="bankser01"] > div[col-id="name"]')
          .should('be.visible')
          .click()
          .end()

          // Scroll to the right.
          .get('#sideScroll .ag-cell-value[col-id="triplecrown"]')
          .should('be.visible')
          .should('not.be.empty')
          .end()
          .get('#sideScroll .ag-cell-value[col-id="mvp"]')
          .should('be.visible')
          .should('not.be.empty')
          .end()
          .get('#sideScroll .ag-cell-value[col-id="cya"]')
          .should('be.visible')
          .should('not.be.empty')
          .end()
          .get('#sideScroll .sky-ag-grid-row-speaktr01 [col-id="mvp"]')
          .should('be.visible')
          .click()
          .end()

          // Activate a lookup multi-select field and add a second value.
          .get(
            '#editLookupMultiple div[row-id="seaveto01"] > div[col-id="name"]'
          )
          .should('be.visible')
          .click()
          .end()
          .get('.ag-popup-editor textarea')
          .should('be.visible')
          .type('gossage')
          .trigger('keydown', { key: 'Enter' })
          .end()

          // Leave the lookup field to show it render multiple values.
          .get(
            '#editLookupMultiple div[row-id="seaveto01"] > div[col-id="birthday"]'
          )
          .should('be.visible')
          .click()
          .end()

          // Activate another lookup multi-select field and enter values, leaving it active.
          .get(
            '#editLookupMultiple div[row-id="simmoal01"] > div[col-id="name"]'
          )
          .should('be.visible')
          .click()
          .end()
          .get('.ag-popup-editor textarea')
          .should('be.visible')
          .type('mat')
          .trigger('keydown', { key: 'Enter' })
          .type('Rabbit')
          .trigger('keydown', { key: 'Enter' })
          .end()

          // Activate a lookup single-select field.
          .get('#editLookup div[row-id="berrayo01"] > div[col-id="name"]')
          .should('be.visible')
          .click()
          .end()

          // Search the lookup field.
          .get('#editLookup .ag-popup-editor textarea')
          .should('be.visible')
          .clear()
          .type('mar', { delay: 100 })
          .wait(100)
          .trigger('keydown', { key: 'ArrowDown' })
          .wait(100)
          .trigger('keydown', { key: 'ArrowDown' })
          .wait(300)
          .end()

          // Verify the lookup field results.
          .get('.ag-custom-component-popup mark.sky-highlight-mark')
          .should('be.visible')
          .should('have.length.gt', 2)
          .end()

          // Screenshot the grids with active editors.
          .get('#root')
          .screenshot(
            `dataentrygridcomponent-dataentrygrid--edit-lookup-${theme}`,
            {
              overwrite: true,
              disableTimersAndAnimations: true,
            }
          )
          .window()
          .percySnapshot(
            `dataentrygridcomponent-dataentrygrid--edit-lookup-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              devicePixelRatio: 1,
            }
          );
      });
    });
  });
});
