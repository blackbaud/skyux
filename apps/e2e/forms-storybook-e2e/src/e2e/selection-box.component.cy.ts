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
        cy.get('#ready')
          .should('exist')
          .end()
          .get('app-selection-box')
          .should('exist')
          .should('be.visible')
          .end()
          .get('app-selection-box sky-selection-box-header')
          .should('contain.text', 'Icon')
          .end()
          .get('app-selection-box sky-selection-box-header')
          .should('contain.text', 'No icon no description')
          .end()
          .get('app-selection-box')
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
