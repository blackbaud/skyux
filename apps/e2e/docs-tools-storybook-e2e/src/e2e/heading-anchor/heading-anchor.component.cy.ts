import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Heading anchor', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=heading-anchorcomponent--heading-anchor`,
        ),
      );

      it('should render the component', () => {
        cy.skyReady('app-heading-anchor');
        cy.get('#screenshot-wrapper')
          .should('exist')
          .should('be.visible')
          .screenshot(`heading-anchor-${theme}`);
        cy.percySnapshot(`heading-anchor-${theme}`, {
          scope: '#screenshot-wrapper',
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
