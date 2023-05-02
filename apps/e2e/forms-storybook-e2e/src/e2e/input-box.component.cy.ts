import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=inputboxcomponent-inputbox--input-box`
        )
      );
      it('should render the component', () => {
        cy.get('app-input-box')
          .should('exist')
          .should('be.visible')
          .screenshot(`inputboxcomponent-inputbox--input-box-${theme}`)
          .percySnapshot(`inputboxcomponent-inputbox--input-box-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });

      it('should properly focus a standard input box', () => {
        cy.get('#input-box-basic')
          .should('exist')
          .should('be.visible')
          .get('#input-box-basic input')
          .click()
          .get('#input-box-basic')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-standard-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-standard-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-basic',
            }
          );
      });

      it('should properly focus a textarea input box', () => {
        cy.get('#input-box-textarea')
          .should('exist')
          .should('be.visible')
          .get('#input-box-textarea textarea')
          .click()
          .get('#input-box-textarea')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-textarea-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-textarea-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-textarea',
            }
          );
      });

      it('should properly focus a select input box', () => {
        cy.get('#input-box-select')
          .should('exist')
          .should('be.visible')
          .get('#input-box-select select')
          .select(1)
          .get('#input-box-select')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-select-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-select-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-select',
            }
          );
      });

      it('should properly focus a input box with buttons', () => {
        cy.get('#input-box-button-multiple')
          .should('exist')
          .should('be.visible')
          .get('#input-box-button-multiple input')
          .click()
          .get('#input-box-button-multiple')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-multiple-buttons-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-multiple-buttons-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-button-multiple',
            }
          );
      });

      it('should properly focus a button inside an input box with buttons', () => {
        cy.get('#input-box-button-multiple')
          .should('exist')
          .should('be.visible')
          .get('#input-box-button-multiple #multiple-calendar-button')
          .focus()
          .get('#input-box-button-multiple')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-multiple-buttons-button-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-multiple-buttons-button-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-button-multiple',
            }
          );
      });

      it('should properly focus a input box with an error', () => {
        cy.get('#input-box-form-control-error')
          .should('exist')
          .should('be.visible')
          .get('#input-box-form-control-error input')
          .click()
          .get('#input-box-form-control-error')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-error-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-error-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-form-control-error',
            }
          );
      });

      it('should properly focus a button within an input box with an error', () => {
        cy.get('#input-box-form-control-error-button-single')
          .should('exist')
          .should('be.visible')
          .get(
            '#input-box-form-control-error-button-single #error-calendar-button'
          )
          .focus()
          .get('#input-box-form-control-error-button-single')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-error-button-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-error-button-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-form-control-error-button-single',
            }
          );
      });

      it('should properly focus a input box with a left button', () => {
        cy.get('#input-box-button-single-left')
          .should('exist')
          .should('be.visible')
          .get('#input-box-button-single-left input')
          .click()
          .get('#input-box-button-single-left')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-left-button-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-left-button-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-button-single-left',
            }
          );
      });

      it('should properly focus a button inside an input box with a left button', () => {
        cy.get('#input-box-button-single-left')
          .should('exist')
          .should('be.visible')
          .get('#input-box-button-single-left #single-left-calendar-button')
          .focus()
          .get('#input-box-button-single-left')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-left-button-button-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-left-button-button-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-button-single-left',
            }
          );
      });

      it('should properly focus a input box with an inset button', () => {
        cy.get('#input-box-button-inset')
          .should('exist')
          .should('be.visible')
          .get('#input-box-button-inset input')
          .click()
          .get('#input-box-button-inset')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-inset-button-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-inset-button-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-button-inset',
            }
          );
      });

      it('should properly focus a button within an input box with an inset button', () => {
        cy.get('#input-box-button-inset')
          .should('exist')
          .should('be.visible')
          .get('#input-box-button-inset #inset-search-button')
          .focus()
          .get('#input-box-button-inset')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-inset-button-button-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-inset-button-button-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-button-inset',
            }
          );
      });

      it('should properly focus a input box with an inset icon', () => {
        cy.get('#input-box-icon-inset')
          .should('exist')
          .should('be.visible')
          .get('#input-box-icon-inset input')
          .click()
          .get('#input-box-icon-inset')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-inset-icon-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-inset-icon-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-icon-inset',
            }
          );
      });

      it('should properly focus a input box with an inset icon on left', () => {
        cy.get('#input-box-icon-inset-left')
          .should('exist')
          .should('be.visible')
          .get('#input-box-icon-inset-left input')
          .click()
          .get('#input-box-icon-inset-left')
          .screenshot(
            `inputboxcomponent-inputbox--input-box-${theme}-inset-icon-left-focus`
          )
          .percySnapshot(
            `inputboxcomponent-inputbox--input-box-${theme}-inset-icon-left-focus`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
              scope: '#input-box-icon-inset-left',
            }
          );
      });
    });
  });
});
