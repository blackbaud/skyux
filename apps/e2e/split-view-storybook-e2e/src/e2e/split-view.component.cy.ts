import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('split-view-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=splitviewcomponent-splitview--split-view`,
        );
        cy.skyReady().end();
      });
      E2eVariations.DISPLAY_WIDTHS.concat(E2eVariations.MOBILE_WIDTHS).forEach(
        (width) => {
          describe(`at ${width}px`, () => {
            it(`should render the split view component`, () => {
              cy.viewport(width, 960);
              cy.get('.screenshot-area')
                .should('exist')
                .should('be.visible')
                .screenshot(
                  `splitviewcomponent-splitview--split-view-dock-fill-${theme}-${width}`,
                );
              cy.get('.screenshot-area').percySnapshot(
                `splitviewcomponent-splitview--split-view-dock-fill-${theme}-${width}`,
                {
                  widths: [width],
                },
              );
            });
          });
        },
      );
      it(`should render the drawer when dock is set to mobile width`, () => {
        E2eVariations.MOBILE_WIDTHS.forEach((width) => {
          cy.viewport(width, 960);
          cy.get('.sky-split-view-workspace-header-content > .sky-btn-link')
            .should('exist')
            .should('be.visible')
            .click();
          cy.get('.screenshot-area')
            .should('exist')
            .should('be.visible')
            .screenshot(
              `splitviewcomponent-splitview--split-view-drawer-mobile-view-${theme}`,
            );
          cy.get('.screenshot-area').percySnapshot(
            `splitviewcomponent-splitview--split-view-drawer-mobile-view-${theme}`,
            {
              widths: [width],
            },
          );
        });
      });
    });
  });
});
