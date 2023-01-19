import { E2eVariations } from '@skyux-sdk/e2e-schematics';

/* spell-checker:ignore dockcomponent */
describe('core-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=dockcomponent-dock--dock`
        )
      );
      it('should render the component', () => {
        cy.get('sky-dock').should('exist').should('be.visible');
        cy.screenshot(`dockcomponent-dock--dock-${theme}`, {
          capture: 'fullPage',
        }).percySnapshot(`dockcomponent-dock--dock-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
