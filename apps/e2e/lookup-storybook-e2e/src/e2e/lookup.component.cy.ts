import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      [
        'multiple-mode',
        'single-mode',
        'single-mode-disabled',
        'multiple-mode-disabled',
      ].forEach((mode) => {
        describe(`in ${mode} lookup`, () => {
          beforeEach(() =>
            cy
              .visit(
                `/iframe.html?globals=theme:${theme}&id=lookupcomponent-lookup--lookup-${mode}`,
              )
              .viewport(1300, 900),
          );
          it(`should render the component`, () => {
            cy.skyReady('app-lookup').screenshot(
              `lookupcomponent-lookup--lookup-${mode}-${theme}`,
            );
            cy.get('app-lookup').percySnapshot(
              `lookupcomponent-lookup--lookup-${mode}-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              },
            );
          });
        });
      });
      ['multiple-mode', 'single-mode'].forEach((mode) => {
        describe(`in ${mode} lookup component`, () => {
          beforeEach(() =>
            cy
              .visit(
                `/iframe.html?globals=theme:${theme}&id=lookupcomponent-lookup--lookup-${mode}`,
              )
              .viewport(1300, 900),
          );
          describe('with show more enabled', () => {
            it('should render show more dropdown with filtering', () => {
              cy.skyReady('app-lookup');

              cy.get('[data-sky-id="lookup-show-more-1"]')
                .should('exist')
                .should('be.visible')
                .type('b');

              cy.get('.sky-autocomplete-results-container')
                .should('exist')
                .should('be.visible');

              cy.get('app-lookup').screenshot(
                `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-with-filtering-${theme}`,
              );
              cy.get('app-lookup').percySnapshot(
                `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-with-filtering-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                },
              );
            });
            it('should render show more dropdown without filtering', () => {
              cy.skyReady('app-lookup');

              cy.get('textarea')
                .eq(4)
                .should('exist')
                .should('be.visible')
                .click();

              cy.get('.sky-autocomplete-results-container')
                .should('exist')
                .should('be.visible');

              cy.get('app-lookup').screenshot(
                `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-no-filtering-${theme}`,
              );
              cy.get('app-lookup').percySnapshot(
                `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-no-filtering-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                },
              );
            });
            it('should render show more dropdown with no results', () => {
              cy.skyReady('app-lookup');

              cy.get('[data-sky-id="lookup-show-more-1"]')
                .should('exist')
                .should('be.visible')
                .type('foo');

              cy.get('.sky-autocomplete-results-container')
                .should('exist')
                .should('be.visible');

              cy.get('app-lookup').screenshot(
                `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-no-results-${theme}`,
              );
              cy.get('app-lookup').percySnapshot(
                `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-no-results-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                },
              );
            });
            it('should render show more dropdown add button', () => {
              cy.skyReady('app-lookup');

              cy.get('textarea')
                .eq(5)
                .should('exist')
                .should('be.visible')
                .focus();

              cy.get('.sky-autocomplete-results-container')
                .should('exist')
                .should('be.visible');

              cy.get('app-lookup').screenshot(
                `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-add-more-button-${theme}`,
              );
              cy.get('app-lookup').percySnapshot(
                `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-add-more-button-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                },
              );
            });
            describe('in show more modal', () => {
              it('should open and render modal', () => {
                cy.skyReady('app-lookup');

                cy.get('textarea')
                  .eq(4)
                  .should('exist')
                  .should('be.visible')
                  .focus();

                cy.get('.sky-autocomplete-action-more')
                  .should('exist')
                  .should('be.visible')
                  .click();

                cy.get('.sky-modal').should('exist').should('be.visible');

                cy.get('app-lookup').screenshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-modal-${theme}`,
                );
                cy.get('app-lookup').percySnapshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-modal-${theme}`,
                  {
                    widths: E2eVariations.DISPLAY_WIDTHS,
                  },
                );
              });
              it('should open and render modal with add more', () => {
                cy.skyReady('app-lookup');

                cy.get('textarea')
                  .eq(5)
                  .should('exist')
                  .should('be.visible')
                  .focus();

                cy.get('.sky-autocomplete-action-more')
                  .should('exist')
                  .should('be.visible')
                  .click();

                cy.get('.sky-modal').should('exist').should('be.visible');

                cy.get('app-lookup').screenshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-modal-add-more-${theme}`,
                );
                cy.get('app-lookup').percySnapshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-modal-add-more-${theme}`,
                  {
                    widths: E2eVariations.DISPLAY_WIDTHS,
                  },
                );
              });
              it('should open and render modal with preselected values', () => {
                cy.skyReady('app-lookup');

                cy.get('textarea')
                  .eq(6)
                  .should('exist')
                  .should('be.visible')
                  .focus();

                cy.get('.sky-autocomplete-action-more')
                  .should('exist')
                  .should('be.visible')
                  .click();

                cy.get('.sky-modal').should('exist').should('be.visible');

                cy.get('app-lookup').screenshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-modal-preselected-values-${theme}`,
                );
                cy.get('app-lookup').percySnapshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-modal-preselected-values-${theme}`,
                  {
                    widths: E2eVariations.DISPLAY_WIDTHS,
                  },
                );
              });
            });
          });
        });
      });
    });
  });
});
