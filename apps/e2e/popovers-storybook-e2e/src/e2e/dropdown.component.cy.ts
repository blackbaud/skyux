import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('popovers-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=dropdowncomponent-dropdown--dropdown`
        )
      );
      it('should render the component', () => {
        cy.get('app-dropdown')
          .should('exist')
          .should('be.visible')
          .screenshot(`dropdowncomponent-dropdown--dropdown-${theme}`)
          .percySnapshot(`dropdowncomponent-dropdown--dropdown-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
