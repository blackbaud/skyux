import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`tabs-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      describe('default tabs', () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=tabscomponent-tabs--tabs`
          )
        );
        it('should render the component', () => {
          cy.get('app-tabs')
            .should('exist')
            .should('be.visible')
            .screenshot(`tabscomponent-tabs--tabs-${theme}`)
            .percySnapshot(`tabscomponent-tabs--tabs-${theme}`);
        });
      });

      describe('dropdown tabs', () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=tabscomponent-tabs--tabs-dropdown`
          )
        );
        it('should render the component', () => {
          cy.get('app-tabs')
            .should('exist')
            .should('be.visible')
            .get('sky-dropdown')
            .should('exist')
            .should('be.visible')
            .screenshot(`tabscomponent-tabs--tabs-dropdown-${theme}`)
            .percySnapshot(`tabscomponent-tabs--tabs-dropdown-${theme}`);
        });
      });
    });
  });
});
