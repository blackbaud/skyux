import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook - radio button', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=radiobuttoncomponent-radiobutton--radio-button`,
        ),
      );

      it('should render the radio buttons', () => {
        cy.skyReady('app-radio-button');

        cy.get('.invalid-radio-button-group sky-radio-label').first().click();

        cy.get('app-radio-button').screenshot(
          `radiobuttoncomponent-radiobutton--radio-button-${theme}`,
        );

        cy.get('app-radio-button').percySnapshot(
          `radiobuttoncomponent-radiobutton--radio-button-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
