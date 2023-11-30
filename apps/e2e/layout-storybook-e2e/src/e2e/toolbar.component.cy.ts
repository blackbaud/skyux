import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=toolbarcomponent-toolbar--toolbar`
        )
      );
      it('should render the component', () => {
        cy.get('app-toolbar')
          .should('exist')
          .should('be.visible')
          .screenshot(`toolbarcomponent-toolbar--toolbar-${theme}`)
          .percySnapshot(`toolbarcomponent-toolbar--toolbar-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
