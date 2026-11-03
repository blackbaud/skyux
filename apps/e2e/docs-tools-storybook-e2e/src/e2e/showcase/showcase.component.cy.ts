import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Showcase', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=showcasecomponent--showcase`,
        ),
      );

      it('should render the development area', () => {
        cy.skyReady('app-showcase');
        cy.get('sky-docs-showcase-area-development')
          .should('exist')
          .should('be.visible');
        cy.get('#screenshot-wrapper')
          .should('exist')
          .should('be.visible')
          .screenshot(`showcase-${theme}`);
        cy.percySnapshot(`showcase-${theme}`, {
          scope: '#screenshot-wrapper',
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
