import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('angular-tree-component-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      [
        'basic',
        'selection-multi-select',
        'selection-multi-select-cascading',
        'selection-single-select',
        'modes',
      ].forEach((mode) => {
        describe(`in ${mode} Tree View Component`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=angulartreecomponentcomponent-angulartreecomponent--${mode}-angular-tree-component`,
            ),
          );
          it('should render the component', () => {
            cy.skyReady('app-angular-tree-component');

            cy.get('tree-node-content')
              .should('exist')
              .first()
              .should('exist')
              .should('be.visible')
              .click();
            cy.get('tree-node-content')
              .should('exist')
              .eq(1)
              .should('exist')
              .should('be.visible')
              .click();

            cy.get('app-angular-tree-component').screenshot(
              `angulartreecomponentcomponent-angulartreecomponent--${mode}-angular-tree-component-${theme}`,
            );
            cy.get('app-angular-tree-component').percySnapshot(
              `angulartreecomponentcomponent-angulartreecomponent--${mode}-angular-tree-component-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              },
            );
          });
        });
      });
    });
  });
});
