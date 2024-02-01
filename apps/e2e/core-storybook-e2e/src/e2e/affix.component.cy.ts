import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('affix', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(1280, 1200)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=affixcomponent-affix--affix`,
          ),
      );
      it('should render the component', () => {
        cy.get('#ready').should('exist');

        cy.window().skyVisualTest(`affix-${theme}--initial`, {
          capture: 'viewport',
        });
        cy.window().scrollTo(0, 175);
        cy.skyVisualTest(`affix-${theme}--scrolled`, {
          capture: 'viewport',
        });
      });
    });
  });
});
