import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`tabs-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      describe('default tabs', () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=tabscomponent-tabs--tabs`,
          ),
        );
        it('should render the component', () => {
          cy.skyReady('app-tabs').screenshot(
            `tabscomponent-tabs--tabs-${theme}`,
          );
          cy.get('app-tabs').percySnapshot(`tabscomponent-tabs--tabs-${theme}`);
        });
      });

      describe('dropdown tabs', () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=tabscomponent-tabs--tabs-dropdown`,
          ),
        );
        it('should render the component', () => {
          cy.skyReady('app-tabs')
            .get('sky-dropdown')
            .should('exist')
            .should('be.visible')
            .screenshot(`tabscomponent-tabs--tabs-dropdown-${theme}`);
          cy.get('sky-dropdown').percySnapshot(
            `tabscomponent-tabs--tabs-dropdown-${theme}`,
          );
        });
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
