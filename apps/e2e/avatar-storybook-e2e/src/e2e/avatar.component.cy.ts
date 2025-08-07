import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('avatar-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=avatarcomponent-avatar--avatar`,
        ),
      );
      it('should render the component', () => {
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(3000);
        cy.skyReady('app-avatar', ['#ready', '#screenshot-wrapper']);
        cy.get('#screenshot-wrapper').screenshot(
          `avatarcomponent-avatar--avatar-${theme}`,
        );
        cy.get('#screenshot-wrapper').percySnapshot(
          `avatarcomponent-avatar--avatar-${theme}`,
          {
            scope: '#screenshot-wrapper',
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
