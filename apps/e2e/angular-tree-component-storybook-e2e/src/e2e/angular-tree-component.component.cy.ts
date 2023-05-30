import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('angular-tree-component-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=angulartreecomponentcomponent-angulartreecomponent--angular-tree-component`
        )
      );
      it('should render the component', () => {
        cy.get('app-angular-tree-component')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `angulartreecomponentcomponent-angulartreecomponent--angular-tree-component-${theme}`
          )
          .percySnapshot(
            `angulartreecomponentcomponent-angulartreecomponent--angular-tree-component-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
