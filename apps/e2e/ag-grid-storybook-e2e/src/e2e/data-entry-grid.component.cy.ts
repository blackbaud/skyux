import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('ag-grid-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      const compactOptions = theme.startsWith('modern')
        ? [false, true]
        : [false];
      compactOptions.forEach((compact) => {
        it(`should edit date and lookup fields${compact ? ', compact' : ''}`, () => {
          cy.viewport(1300, 1200).visit(
            /* spell-checker:disable-next-line */
            `/iframe.html?globals=theme:${theme}&id=dataentrygridcomponent-dataentrygrid--data-entry-grid-date-and-lookup${compact ? '-compact' : ''}`,
          );
          cy.get('#ready')
            .should('exist')
            .end()
            // Activate a lookup field.
            /* spell-checker:disable-next-line */
            .get('#editLookup div[row-id="alexape01"] > div[col-id="name"]')
            .should('be.visible')
            .click();

          // Activate a date field without the calendar.
          /* spell-checker:disable-next-line */
          cy.get('#editDate div[row-id="bankser01"] > div[col-id="birthday"]')
            .should('be.visible')
            .click();

          // Activate a date field.
          cy.get(
            /* spell-checker:disable-next-line */
            '#editDateWithCalendar div[row-id="blylebe01"] > div[col-id="birthday"]',
          )
            .should('be.visible')
            .click();

          // Open the calendar and verify 04/06/1951 is selected.
          cy.get(
            '#editDateWithCalendar .ag-popup-editor button[aria-label="Select date"]',
          )
            .should('be.visible')
            .click();

          cy.get('.ag-custom-component-popup .sky-datepicker-btn-selected')
            .should('be.visible')
            .should('contain.text', '06')
            .end()

            // Expect inline help buttons to be visible in three grids.
            .get('#editDateWithCalendar [col-id="name"] button.sky-help-inline')
            .should('exist')
            .should('be.visible')
            .end()

            .get('#editDate [col-id="name"] button.sky-help-inline')
            .should('exist')
            .should('be.visible')
            .end()

            .get('#editLookup [col-id="name"] button.sky-help-inline')
            .should('exist')
            .should('be.visible')
            .end()

            // Screenshot the three grids with active editors.
            .get('#storybook-root')
            .skyVisualTest(
              /* spell-checker:disable-next-line */
              `dataentrygridcomponent-dataentrygrid--date-and-lookup-${theme}${compact ? '-compact' : ''}`,
              {
                overwrite: true,
                disableTimersAndAnimations: true,
                onBeforeScreenshot: ($el: JQuery) => {
                  $el.css('caret-color', 'transparent');
                },
                onAfterScreenshot: ($el: JQuery) => {
                  $el.css('caret-color', 'initial');
                },
              },
            );
        });

        it(`should edit lookup field, showing results${compact ? ', compact' : ''}`, () => {
          cy.viewport(1300, 1200).visit(
            /* spell-checker:disable-next-line */
            `/iframe.html?globals=theme:${theme}&id=dataentrygridcomponent-dataentrygrid--data-entry-grid-edit-lookup${compact ? '-compact' : ''}`,
          );
          // Briefly wait between arrowing down.
          cy.get('#ready').should('exist');

          // Activate a text field.
          /* spell-checker:disable-next-line */
          cy.get('#editText div[row-id="benchjo01"] > div[col-id="name"]')
            .should('be.visible')
            .click();

          // Focus on a cell in the middle of the grid.
          /* spell-checker:disable-next-line */
          cy.get('#sideScroll .ag-cell-value[col-id="triplecrown"]')
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
            /* spell-checker:disable-next-line */
            .get('#sideScroll .sky-ag-grid-row-speaktr01 [col-id="mvp"]')
            .should('be.visible')
            .click();

          // Activate a lookup multi-select field and add a second value.
          cy.get(
            /* spell-checker:disable-next-line */
            '#editLookupMultiple div[row-id="seaveto01"] > div[col-id="name"]',
          )
            .should('be.visible')
            .click();

          cy.get('.ag-popup-editor textarea')
            .should('be.visible')
            /* spell-checker:disable-next-line */
            .type('gossage');
          cy.get('.ag-popup-editor textarea').trigger('keydown', {
            key: 'Enter',
          });

          // Leave the lookup field to show it render multiple values.
          cy.get(
            /* spell-checker:disable-next-line */
            '#editLookupMultiple div[row-id="seaveto01"] > div[col-id="birthday"]',
          )
            .should('be.visible')
            .click();

          // Activate another lookup multi-select field and enter values, leaving it active.
          cy.get(
            /* spell-checker:disable-next-line */
            '#editLookupMultiple div[row-id="simmoal01"] > div[col-id="name"]',
          )
            .should('be.visible')
            .click();

          cy.get('.ag-popup-editor textarea').should('be.visible').type('mat');
          cy.get('.ag-popup-editor textarea').trigger('keydown', {
            key: 'Enter',
          });
          cy.get('.ag-popup-editor textarea').type('Rabbit');
          cy.get('.ag-popup-editor textarea').trigger('keydown', {
            key: 'Enter',
          });

          // Activate a lookup single-select field.
          /* spell-checker:disable-next-line */
          cy.get('#editLookup div[row-id="berrayo01"] > div[col-id="name"]')
            .should('be.visible')
            .click();

          // Search the lookup field.
          cy.get('#editLookup .ag-popup-editor textarea')
            .should('be.visible')
            .clear();
          cy.get('#editLookup .ag-popup-editor textarea').type('mar', {
            delay: 100,
          });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.get('#editLookup .ag-popup-editor textarea')
            .wait(100)
            .trigger('keydown', { key: 'ArrowDown' });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.get('#editLookup .ag-popup-editor textarea')
            .wait(100)
            .trigger('keydown', { key: 'ArrowDown' });
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(300);

          // Verify the lookup field results.
          cy.get('.ag-custom-component-popup mark.sky-highlight-mark')
            .should('be.visible')
            .should('have.length.gt', 2)
            .end()

            // Screenshot the grids with active editors.
            .get('#storybook-root')
            .skyVisualTest(
              /* spell-checker:disable-next-line */
              `dataentrygridcomponent-dataentrygrid--edit-lookup-${theme}${compact ? '-compact' : ''}`,
              {
                overwrite: true,
                disableTimersAndAnimations: true,
                onBeforeScreenshot: ($el: JQuery) => {
                  $el.css('caret-color', 'transparent');
                },
                onAfterScreenshot: ($el: JQuery) => {
                  $el.css('caret-color', 'initial');
                },
              },
            );
        });
      });
    });
  });
});
