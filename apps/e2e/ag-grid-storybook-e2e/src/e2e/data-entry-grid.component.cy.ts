import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('ag-grid-storybook data entry grid', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(
      `in ${theme} theme`,
      {
        viewportWidth: 1300,
        viewportHeight: 1200,
      },
      () => {
        const compactOptions = theme.startsWith('modern')
          ? [false, true]
          : [false];
        compactOptions.forEach((compact) => {
          it(`should edit date and lookup fields${compact ? ', compact' : ''}`, () => {
            cy.visit(
              /* spell-checker:disable-next-line */
              `/iframe.html?globals=theme:${theme}&id=dataentrygridcomponent-dataentrygrid--data-entry-grid-date-and-lookup${compact ? '-compact' : ''}`,
            );
            cy.skyReady('app-data-entry-grid', ['#ready']);
            cy.get(
              '#checkboxes .ag-viewport > .ag-center-cols-container > .ag-row',
            )
              .should('exist')
              .should('have.length', 3);
            cy.get(
              '#editDate .ag-viewport > .ag-center-cols-container > .ag-row',
            )
              .should('exist')
              .should('have.length', 3);
            cy.get(
              '#editDateWithCalendar .ag-viewport > .ag-center-cols-container > .ag-row',
            )
              .should('exist')
              .should('have.length.gte', 7);
            cy.get(
              '#editLookup .ag-viewport > .ag-center-cols-container > .ag-row',
            )
              .should('exist')
              .should('have.length', 3);

            // Activate a lookup field.
            /* spell-checker:disable-next-line */
            cy.get('#editLookup div[row-id="aaronha01"] > div[col-id="name"]')
              .should('be.visible')
              .click();
            cy.get(
              '#editLookup .ag-popup-editor sky-ag-grid-cell-editor-lookup',
            ).should('exist');
            cy.get(
              '#editLookup .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            )
              .should('exist')
              .should('be.visible')
              .should('have.focus');

            // Activate a date field without the calendar.
            /* spell-checker:disable-next-line */
            cy.get('#editDate div[row-id="bankser01"] > div[col-id="birthday"]')
              .should('be.visible')
              .click();
            cy.get(
              '#editDate .ag-popup-editor sky-ag-grid-cell-editor-datepicker',
            ).should('exist');
            cy.get(
              /* spell-checker:disable-next-line */
              '#editDate .ag-popup-editor sky-ag-grid-cell-editor-datepicker input[skydatepickerinput]',
            )
              .should('exist')
              .should('be.visible')
              .should('have.focus');

            // Activate a date field.
            cy.get(
              /* spell-checker:disable-next-line */
              '#editDateWithCalendar div[row-id="blylebe01"] > div[col-id="birthday"]',
            )
              .should('be.visible')
              .click();
            cy.get(
              '#editDateWithCalendar .ag-popup-editor sky-ag-grid-cell-editor-datepicker',
            ).should('exist');
            cy.get(
              /* spell-checker:disable-next-line */
              '#editDateWithCalendar .ag-popup-editor sky-ag-grid-cell-editor-datepicker input[skydatepickerinput]',
            )
              .should('exist')
              .should('be.visible')
              .should('have.focus');

            // Open the calendar and verify 04/06/1951 is selected.
            cy.get(
              '#editDateWithCalendar .ag-popup-editor button[aria-label="Select date"]',
            )
              .should('be.visible')
              .click();

            cy.get('.ag-custom-component-popup .sky-datepicker-btn-selected')
              .should('be.visible')
              .should('contain.text', '06');

            // Expect inline help buttons to be visible in three grids.
            cy.get(
              '#editDateWithCalendar [col-id="name"] button.sky-help-inline',
            )
              .should('exist')
              .should('be.visible');

            cy.get('#editDate [col-id="name"] button.sky-help-inline')
              .should('exist')
              .should('be.visible');

            cy.get('#editLookup [col-id="name"] button.sky-help-inline')
              .should('exist')
              .should('be.visible');

            // Screenshot the three grids with active editors.
            cy.window().skyVisualTest(
              /* spell-checker:disable-next-line */
              `dataentrygridcomponent-dataentrygrid--date-and-lookup-${theme}${compact ? '-compact' : ''}`,
              {
                capture: 'viewport',
                disableTimersAndAnimations: true,
                overwrite: true,
                scale: false,
              },
            );
          });

          it(`should edit lookup field, showing results${compact ? ', compact' : ''}`, () => {
            cy.visit(
              /* spell-checker:disable-next-line */
              `/iframe.html?globals=theme:${theme}&id=dataentrygridcomponent-dataentrygrid--data-entry-grid-edit-lookup${compact ? '-compact' : ''}`,
            );
            // Briefly wait between arrowing down.
            cy.skyReady('app-data-entry-grid', ['#ready']);
            cy.get(
              '#sideScroll .ag-viewport > .ag-center-cols-container > .ag-row',
            )
              .should('exist')
              .should('have.length', 3);
            cy.get(
              '#editText .ag-viewport > .ag-center-cols-container > .ag-row',
            )
              .should('exist')
              .should('have.length', 3);
            cy.get(
              '#editLookup .ag-viewport > .ag-center-cols-container > .ag-row',
            )
              .should('exist')
              .should('have.length', 5);
            cy.get(
              '#editLookupMultiple .ag-viewport > .ag-center-cols-container > .ag-row',
            )
              .should('exist')
              .should('have.length', 5);

            // Activate a text field.
            /* spell-checker:disable-next-line */
            cy.get('#editText')
              .contains('Ernie Banks')
              .should('exist')
              .should('be.visible')
              .focus();
            cy.get('#editText')
              .contains('Ernie Banks')
              .should('have.focus')
              .trigger('keydown', {
                key: 'Enter',
              });
            cy.get(
              /* spell-checker:disable-next-line */
              '#editText div[row-id="bankser01"] > div[col-id="name"] > sky-ag-grid-cell-editor-text > input',
            )
              .should('exist')
              .should('be.visible')
              .should('have.focus');
            cy.get(
              '#editText .ag-viewport > .ag-center-cols-container > .ag-row',
            )
              .should('exist')
              .should('have.length', 3);

            // Focus on a cell in the middle of the grid.
            /* spell-checker:disable-next-line */
            cy.get('#sideScroll .ag-cell-value[col-id="triplecrown"]')
              .should('be.visible')
              .should('not.be.empty');

            cy.get('#sideScroll .ag-cell-value[col-id="mvp"]')
              .should('be.visible')
              .should('not.be.empty');

            cy.get('#sideScroll .ag-cell-value[col-id="cya"]')
              .should('be.visible')
              .should('not.be.empty');

            /* spell-checker:disable-next-line */
            cy.get('#sideScroll .sky-ag-grid-row-speaktr01 [col-id="mvp"]')
              .should('be.visible')
              .click();
            cy.get(
              /* spell-checker:disable-next-line */
              '#sideScroll .sky-ag-grid-row-speaktr01 [col-id="mvp"] > sky-ag-grid-cell-editor-number > input',
            )
              .should('exist')
              .should('be.visible')
              .should('have.focus');

            // Activate a lookup multi-select field and add a second value.
            cy.get(
              /* spell-checker:disable-next-line */
              '#editLookupMultiple div[row-id="seaveto01"] > div[col-id="name"]',
            )
              .should('be.visible')
              .click();
            cy.get(
              '#editLookupMultiple .ag-popup-editor sky-ag-grid-cell-editor-lookup',
            ).should('exist');
            cy.get(
              '#editLookupMultiple .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            )
              .should('exist')
              .should('be.visible')
              .should('have.focus')
              /* spell-checker:disable-next-line */
              .type('gossage');
            cy.get(
              '#editLookupMultiple .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            ).trigger('keydown', {
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
            cy.get(
              '#editLookupMultiple .ag-popup-editor sky-ag-grid-cell-editor-lookup',
            ).should('exist');
            cy.get(
              '#editLookupMultiple .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            )
              .should('exist')
              .should('be.visible')
              .should('have.focus')
              .type('mat');
            cy.get(
              '#editLookupMultiple .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            ).trigger('keydown', {
              key: 'Enter',
            });
            cy.get(
              '#editLookupMultiple .ag-popup-editor sky-ag-grid-cell-editor-lookup',
            )
              .find('button')
              .filter(
                (_index, element) =>
                  !!element.textContent?.includes('Christy Mathewson'),
              )
              .should('exist')
              .should('be.visible');
            cy.get(
              '#editLookupMultiple .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            ).type('Rabbit');
            cy.get(
              '#editLookupMultiple .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            ).trigger('keydown', {
              key: 'Enter',
            });
            cy.get(
              '#editLookupMultiple .ag-popup-editor sky-ag-grid-cell-editor-lookup',
            )
              .find('button')
              .filter(
                (_index, element) =>
                  /* spell-checker:disable-next-line */
                  !!element.textContent?.includes('Rabbit Maranville'),
              )
              .should('exist')
              .should('be.visible');

            // Activate a lookup single-select field.
            /* spell-checker:disable-next-line */
            cy.get('#editLookup div[row-id="berrayo01"] > div[col-id="name"]')
              .should('be.visible')
              .click();
            // Search the lookup field.
            cy.get(
              '#editLookup .ag-popup-editor sky-ag-grid-cell-editor-lookup',
            ).should('exist');
            cy.get(
              '#editLookup .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            )
              .should('exist')
              .should('be.visible')
              .should('have.focus')
              .clear();
            cy.get(
              '#editLookup .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            ).type('mar', {
              delay: 100,
            });
            cy.get('sky-overlay [role="listbox"]')
              .should('exist')
              .should('be.visible');
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.get(
              '#editLookup .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            )
              .wait(100)
              .trigger('keydown', { key: 'ArrowDown' });
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.get(
              '#editLookup .ag-popup-editor sky-ag-grid-cell-editor-lookup textarea',
            )
              .wait(100)
              .trigger('keydown', { key: 'ArrowDown' });
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(300);

            // Verify the lookup field results.
            cy.get('.ag-custom-component-popup mark.sky-highlight-mark')
              .should('be.visible')
              .should('have.length.gt', 2);

            // Screenshot the grids with active editors.
            cy.window().skyVisualTest(
              /* spell-checker:disable-next-line */
              `dataentrygridcomponent-dataentrygrid--edit-lookup-${theme}${compact ? '-compact' : ''}`,
              {
                capture: 'viewport',
                disableTimersAndAnimations: true,
                overwrite: true,
                scale: false,
              },
            );
          });
        });
      },
    );
  });
});
