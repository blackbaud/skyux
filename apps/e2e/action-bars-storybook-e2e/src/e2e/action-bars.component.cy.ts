import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('action-bars-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=actionbarscomponent-actionbars--action-bars`
        )
      );
      it('should render the component', () => {
        cy.get('app-action-bars')
          .should('exist')
          .should('be.visible')
          .screenshot(`actionbarscomponent-actionbars--action-bars-${theme}`)
          .percySnapshot(
            `actionbarscomponent-actionbars--action-bars-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
