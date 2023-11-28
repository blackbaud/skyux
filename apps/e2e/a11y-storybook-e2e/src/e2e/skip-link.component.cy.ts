import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('a11y-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(500, 200)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=skiplinkcomponent-skiplink--skip-link`,
          ),
      );
      it('should render the component', () => {
        cy.get('#ready')
          .should('exist')
          .end()
          .get('.sky-skip-link')
          .should('exist')
          .focus()
          .should('be.visible');
        cy.skyVisualTest(`skiplinkcomponent-skiplink--skip-link-${theme}`, {
          capture: 'fullPage',
          overwrite: true,
          disableTimersAndAnimations: true,
        });
      });
    });
  });
});
