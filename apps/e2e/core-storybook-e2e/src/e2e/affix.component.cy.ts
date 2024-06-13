import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('affix', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => cy.viewport(1280, 1200));

      it('should render the component', () => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=affixcomponent-affix--affix`,
        );
        cy.get('#ready').should('exist');

        cy.window().skyVisualTest(`affix-${theme}--initial`, {
          capture: 'viewport',
        });
        cy.window().scrollTo(0, 175);
        cy.skyVisualTest(`affix-${theme}--scrolled`, {
          capture: 'viewport',
        });
      });

      it('should affix on wide pages', () => {
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=affixcomponent-affix--affix-overflow`,
        );
        cy.get('#ready').should('exist');

        cy.window().scrollTo(880, 0);
        cy.skyVisualTest(`affix-${theme}--overflow`, {
          capture: 'viewport',
        });
      });
    });
  });
});
