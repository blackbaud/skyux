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
        cy.get('.sky-skip-link')
          .should('exist')
          .should('be.visible')
          .should('be.focused')
          .should('have.attr', 'autofocus');

        cy.get('.sky-skip-link')
          .screenshot(`skiplinkcomponent-skiplink--skip-link-${theme}`, {
            capture: 'fullPage',
          })
          .percySnapshot(`skiplinkcomponent-skiplink--skip-link-${theme}`, {
            enableJavaScript: true,
            widths: E2eVariations.DISPLAY_WIDTHS,
          });

        cy.get('.sky-skip-link').focus();
      });
    });
  });
});
