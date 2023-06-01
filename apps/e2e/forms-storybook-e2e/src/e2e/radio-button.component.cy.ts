import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook - radio button', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=radiobuttoncomponent-radiobutton--radio-button`
        )
      );

      it('should render the radio buttons', () => {
        cy.get('app-radio-button')
          .should('exist')
          .should('be.visible')
          .screenshot(`radiobuttoncomponent-radiobutton--radio-button-${theme}`)
          .percySnapshot(
            `radiobuttoncomponent-radiobutton--radio-button-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
