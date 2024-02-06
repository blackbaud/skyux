import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lists-storybook - infinite-scroll', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      [
        'ready',
        'loading',
        'ready-scrollable-parent',
        'loading-scrollable-parent',
      ].forEach((style) => {
        it(`should render the component (${style})`, () => {
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=infinitescrollcomponent-infinitescroll--infinite-scroll-${style}`,
          );

          cy.get('#ready').should('exist').end();
          cy.get('app-infinite-scroll')
            .should('exist')
            .should('be.visible')
            .screenshot(
              `infinitescrollcomponent-infinitescroll--infinite-scroll-${style}-${theme}`,
            );
          cy.get('app-infinite-scroll').percySnapshot(
            `infinitescrollcomponent-infinitescroll--infinite-scroll-${style}-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
        });
      });
    });
  });
});
