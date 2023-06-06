import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['multiple-mode', 'single-mode', 'disabled'].forEach((mode) => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=lookupcomponent-lookup--lookup-${mode}`
          )
        );
        it(`should render the ${mode} lookup component`, () => {
          cy.get('app-lookup')
            .should('exist')
            .should('be.visible')
            .screenshot(`lookupcomponent-lookup--lookup-${mode}-${theme}`)
            .percySnapshot(`lookupcomponent-lookup--lookup-${mode}-${theme}`, {
              widths: E2eVariations.DISPLAY_WIDTHS,
            });
        });
      });
      ['multiple-mode', 'single-mode'].forEach((mode) => {
        describe(`in ${mode} lookup component`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=lookupcomponent-lookup--lookup-${mode}`
            )
          );
          describe('with show more enabled', () => {
            it.only('should render show more dropdown with filtering', () => {
              cy.get('app-lookup').should('exist').should('be.visible');

              cy.get('[ng-reflect-enable-show-more="true"')
                .first()
                .should('exist')
                .should('be.visible')
                .type('b')
                .end();

              cy.get('.sky-autocomplete-results-container')
                .should('exist')
                .should('be.visible');

              cy.get('app-lookup')
                .screenshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-with-filtering-${theme}`
                )
                .percySnapshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-with-filtering-${theme}`,
                  {
                    widths: E2eVariations.DISPLAY_WIDTHS,
                  }
                );
            });
            it('should render show more dropdown without filtering', () => {
              cy.get('app-lookup').should('exist').should('be.visible');

              cy.get('textarea')
                .eq(4)
                .should('exist')
                .should('be.visible')
                .click()
                .end();

              cy.get('.sky-autocomplete-results-container')
                .should('exist')
                .should('be.visible');

              cy.get('app-lookup')
                .screenshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-no-filtering-${theme}`
                )
                .percySnapshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-no-filtering-${theme}`,
                  {
                    widths: E2eVariations.DISPLAY_WIDTHS,
                  }
                );
            });
            it('should render show more dropdown with no results', () => {
              cy.get('app-lookup').should('exist').should('be.visible');

              cy.get('[ng-reflect-enable-show-more="true"')
                .first()
                .should('exist')
                .should('be.visible')
                .type('foo')
                .end();

              cy.get('.sky-autocomplete-results-container')
                .should('exist')
                .should('be.visible');

              cy.get('app-lookup')
                .screenshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-no-results-${theme}`
                )
                .percySnapshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-no-results-${theme}`,
                  {
                    widths: E2eVariations.DISPLAY_WIDTHS,
                  }
                );
            });
            it('should render show more dropdown add button', () => {
              cy.get('app-lookup').should('exist').should('be.visible');

              cy.get('textarea')
                .eq(5)
                .should('exist')
                .should('be.visible')
                .focus();

              cy.get('.sky-autocomplete-results-container')
                .should('exist')
                .should('be.visible');

              cy.get('app-lookup')
                .screenshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-add-more-button-${theme}`
                )
                .percySnapshot(
                  `lookupcomponent-lookup--lookup-${mode}-show-more-dropdown-add-more-button-${theme}`,
                  {
                    widths: E2eVariations.DISPLAY_WIDTHS,
                  }
                );
            });
            describe('in show more modal', () => {
              it('should open and render modal', () => {
                cy.get('app-lookup').should('exist').should('be.visible');

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

                cy.get('app-lookup')
                  .screenshot(
                    `lookupcomponent-lookup--lookup-${mode}-show-more-modal-${theme}`
                  )
                  .percySnapshot(
                    `lookupcomponent-lookup--lookup-${mode}-show-more-modal-${theme}`,
                    {
                      widths: E2eVariations.DISPLAY_WIDTHS,
                    }
                  );
              });
              it('should open and render modal with add more', () => {
                cy.get('app-lookup').should('exist').should('be.visible');

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

                cy.get('app-lookup')
                  .screenshot(
                    `lookupcomponent-lookup--lookup-${mode}-show-more-modal-add-more-${theme}`
                  )
                  .percySnapshot(
                    `lookupcomponent-lookup--lookup-${mode}-show-more-modal-add-more-${theme}`,
                    {
                      widths: E2eVariations.DISPLAY_WIDTHS,
                    }
                  );
              });
              it('should open and render modal with preselected values', () => {
                cy.get('app-lookup').should('exist').should('be.visible');

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

                cy.get('app-lookup')
                  .screenshot(
                    `lookupcomponent-lookup--lookup-${mode}-show-more-modal-preselected-values-${theme}`
                  )
                  .percySnapshot(
                    `lookupcomponent-lookup--lookup-${mode}-show-more-modal-preselected-values-${theme}`,
                    {
                      widths: E2eVariations.DISPLAY_WIDTHS,
                    }
                  );
              });
            });
          });
        });
      });
    });
  });
});
