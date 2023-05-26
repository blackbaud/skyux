import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lookup-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=lookupcomponent-lookup--lookup`
        )
      );
      it('should render the component', () => {
        cy.get('app-lookup')
          .should('exist')
          .should('be.visible')
          .screenshot(`lookupcomponent-lookup--lookup-${theme}`)
          .percySnapshot(`lookupcomponent-lookup--lookup-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
