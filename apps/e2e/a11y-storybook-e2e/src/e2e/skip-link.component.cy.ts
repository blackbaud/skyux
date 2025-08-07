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
        cy.skyReady();
        cy.get('.sky-skip-link').should('exist').focus();
        cy.get('.sky-skip-link').should('be.visible');
        cy.skyVisualTest(`skiplinkcomponent-skiplink--skip-link-${theme}`, {
          capture: 'fullPage',
          overwrite: true,
          disableTimersAndAnimations: true,
        });
      });
    });
  });
});
