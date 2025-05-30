import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('split-view-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      // TODO: make new array with Lg and Xs widths
      E2eVariations.DISPLAY_WIDTHS.concat(E2eVariations.MOBILE_WIDTHS).forEach(
        (width) => {
          describe(`at ${width}px`, () => {
            beforeEach(() => {
              cy.viewport(width, 960);
              cy.visit(
                `/iframe.html?globals=theme:${theme}&id=splitviewcomponent-splitview--split-view`,
              );
            });
            it(`should fill the page when dock is set to fill at width ${width}`, () => {
              cy.skyReady()
                .end()
                .get('.screenshot-area')
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
    });
  });
});
