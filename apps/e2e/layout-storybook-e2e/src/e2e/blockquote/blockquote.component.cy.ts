import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Blockquote', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=blockquotecomponent--blockquote`,
        ),
      );

      it('should render the component', () => {
        cy.skyReady('app-blockquote');
        cy.get('#screenshot-wrapper')
          .should('exist')
          .should('be.visible')
          .screenshot(`blockquote-${theme}`);
        cy.percySnapshot(`blockquote-${theme}`, {
          scope: '#screenshot-wrapper',
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
