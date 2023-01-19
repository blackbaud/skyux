import { E2eVariations } from '@skyux-sdk/e2e-schematics';

/* spell-checker:ignore boxcomponent */
describe('layout-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=boxcomponent-box--box&args=showHelp:false;`
        )
      );
      it('should render the component', () => {
        cy.get('app-box')
          .should('exist')
          .should('be.visible')
          .screenshot(`boxcomponent-box--box-${theme}`)
          .percySnapshot(`boxcomponent-box--box-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
