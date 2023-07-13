import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=selectionboxcomponent-selectionbox--selection-box`
        )
      );
      it('should render the component', () => {
        cy.get('app-selection-box')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `selectionboxcomponent-selectionbox--selection-box-${theme}`
          )
          .percySnapshot(
            `selectionboxcomponent-selectionbox--selection-box-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
