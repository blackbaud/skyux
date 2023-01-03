import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('a11y-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=skiplinkcomponent-skiplink--skip-link`
        )
      );
      it('should render the component', () => {
        cy.get('app-skip-link')
          .should('exist')
          .should('be.visible')
          .screenshot(`skiplinkcomponent-skiplink--skip-link-${theme}`)
          .percySnapshot(`skiplinkcomponent-skiplink--skip-link-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
