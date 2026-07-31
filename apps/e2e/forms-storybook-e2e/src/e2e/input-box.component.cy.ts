import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook - input box', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=inputboxcomponent-inputbox--input-box`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-input-box').screenshot(
          `inputboxcomponent-inputbox--input-box-${theme}`,
        );
        cy.get('app-input-box').percySnapshot(
          `inputboxcomponent-inputbox--input-box-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      it('should properly focus a standard input box', () => {
        cy.skyReady('app-input-box', [], ['#input-box-basic'])
          .get('#input-box-basic input')
          .click();
        cy.get('#input-box-basic').screenshot(
          `inputboxcomponent-inputbox--input-box-${theme}-standard-focus`,
        );
        cy.get('#input-box-basic').percySnapshot(
          `inputboxcomponent-inputbox--input-box-${theme}-standard-focus`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
            scope: '#input-box-basic',
          },
        );
      });

      it('should properly focus a textarea input box', () => {
        cy.skyReady('app-input-box', [], ['#input-box-textarea'])
          .get('#input-box-textarea textarea')
          .click();
        cy.get('#input-box-textarea').screenshot(
          `inputboxcomponent-inputbox--input-box-${theme}-textarea-focus`,
        );
        cy.get('#input-box-textarea').percySnapshot(
          `inputboxcomponent-inputbox--input-box-${theme}-textarea-focus`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
            scope: '#input-box-textarea',
          },
        );
      });

      it('should properly focus a select input box', () => {
        cy.skyReady('app-input-box', [], ['#input-box-select'])
          .get('#input-box-select select')
          .select(1);
        cy.get('#input-box-select').screenshot(
          `inputboxcomponent-inputbox--input-box-${theme}-select-focus`,
        );
        cy.get('#input-box-select').percySnapshot(
          `inputboxcomponent-inputbox--input-box-${theme}-select-focus`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
            scope: '#input-box-select',
          },
        );
      });

      it('should properly focus a input box with buttons', () => {
        cy.skyReady('app-input-box', [], ['#input-box-button-multiple'])
          .get('#input-box-button-multiple input')
          .click();
        cy.get('#input-box-button-multiple').screenshot(
          `inputboxcomponent-inputbox--input-box-${theme}-multiple-buttons-focus`,
        );
        cy.get('#input-box-button-multiple').percySnapshot(
          `inputboxcomponent-inputbox--input-box-${theme}-multiple-buttons-focus`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
            scope: '#input-box-button-multiple',
          },
        );
      });

      it('should properly focus a input box with an error', () => {
        cy.skyReady('app-input-box', [], ['#input-box-form-control-error'])
          .get('#input-box-form-control-error input')
          .click();
        cy.get('#input-box-form-control-error').screenshot(
          `inputboxcomponent-inputbox--input-box-${theme}-error-focus`,
        );
        cy.get('#input-box-form-control-error').percySnapshot(
          `inputboxcomponent-inputbox--input-box-${theme}-error-focus`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
            scope: '#input-box-form-control-error',
          },
        );
      });

      it('should properly focus a input box with a left button', () => {
        cy.skyReady('app-input-box', [], ['#input-box-button-single-left'])
          .get('#input-box-button-single-left input')
          .click();
        cy.get('#input-box-button-single-left').screenshot(
          `inputboxcomponent-inputbox--input-box-${theme}-left-button-focus`,
        );
        cy.get('#input-box-button-single-left').percySnapshot(
          `inputboxcomponent-inputbox--input-box-${theme}-left-button-focus`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
            scope: '#input-box-button-single-left',
          },
        );
      });

      it('should properly focus a input box with an inset button', () => {
        cy.skyReady('app-input-box', [], ['#input-box-button-inset'])
          .get('#input-box-button-inset input')
          .click();
        cy.get('#input-box-button-inset').screenshot(
          `inputboxcomponent-inputbox--input-box-${theme}-inset-button-focus`,
        );
        cy.percySnapshot(
          `inputboxcomponent-inputbox--input-box-${theme}-inset-button-focus`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
            scope: '#input-box-button-inset',
          },
        );
      });

      it('should properly focus a input box with an inset icon', () => {
        cy.skyReady('app-input-box', [], ['#input-box-icon-inset'])
          .get('#input-box-icon-inset input')
          .click();
        cy.get('#input-box-icon-inset').screenshot(
          `inputboxcomponent-inputbox--input-box-${theme}-inset-icon-focus`,
        );
        cy.get('#input-box-icon-inset').percySnapshot(
          `inputboxcomponent-inputbox--input-box-${theme}-inset-icon-focus`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
            scope: '#input-box-icon-inset',
          },
        );
      });

      it('should properly focus a input box with an inset icon on left', () => {
        cy.skyReady('app-input-box', [], ['#input-box-icon-inset-left'])
          .get('#input-box-icon-inset-left input')
          .click();
        cy.get('#input-box-icon-inset-left').screenshot(
          `inputboxcomponent-inputbox--input-box-${theme}-inset-icon-left-focus`,
        );
        cy.get('#input-box-icon-inset-left').percySnapshot(
          `inputboxcomponent-inputbox--input-box-${theme}-inset-icon-left-focus`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
            scope: '#input-box-icon-inset-left',
          },
        );
      });
    });
  });
});
