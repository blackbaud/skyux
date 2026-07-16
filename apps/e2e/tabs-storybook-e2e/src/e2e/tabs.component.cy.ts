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
            .should('be.visible');
          // The active tab button lives in the hidden `.sky-tabset-tabs` strip
          // even in dropdown mode, and focusing it on init can shift the
          // shared scroll container. Reset scroll so the visible dropdown
          // trigger's left inset renders consistently for the snapshot.
          cy.get('.sky-tabset').invoke('scrollLeft', 0);
          cy.get('sky-dropdown').screenshot(
            `tabscomponent-tabs--tabs-dropdown-${theme}`,
          );
          cy.get('sky-dropdown').percySnapshot(
            `tabscomponent-tabs--tabs-dropdown-${theme}`,
          );
        });
        it('should render the component - open', () => {
          cy.skyReady('app-tabs')
            .get('.sky-dropdown-button')
            .should('exist')
            .should('be.visible')
            // `.sky-dropdown-button` is inside the same scrollable
            // `.sky-tabset` container as the tab buttons. Skipping Cypress's
            // scroll-into-view here (instead of resetting scroll afterward)
            // tests whether this click was actually contributing to the
            // scroll shift, or whether it's solely the `ngAfterViewInit`
            // focus-on-init behavior from the other test.
            .click({ scrollBehavior: false });
          cy.get('app-tabs')
            .should('exist')
            .should('be.visible')
            .screenshot(`tabscomponent-tabs--tabs-dropdown-open-${theme}`);
          cy.get('app-tabs').percySnapshot(
            `tabscomponent-tabs--tabs-dropdown-open-${theme}`,
          );
        });
      });
    });
  });
});
