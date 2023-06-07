import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lists-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=infinitescrollcomponent-infinitescroll--infinite-scroll`
        )
      );
      it('should render the component', () => {
        cy.get('app-infinite-scroll')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `infinitescrollcomponent-infinitescroll--infinite-scroll-${theme}`
          )
          .percySnapshot(
            `infinitescrollcomponent-infinitescroll--infinite-scroll-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
