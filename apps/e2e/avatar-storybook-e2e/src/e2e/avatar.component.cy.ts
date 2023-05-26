import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('avatar-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=avatarcomponent-avatar--avatar`
        )
      );
      it('should render the component', () => {
        cy.get('app-avatar')
          .should('exist')
          .should('be.visible')
          .screenshot(`avatarcomponent-avatar--avatar-${theme}`)
          .percySnapshot(`avatarcomponent-avatar--avatar-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
