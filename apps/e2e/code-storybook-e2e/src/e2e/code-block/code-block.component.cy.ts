import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Code Block', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=code-blockcomponent--code-block`,
        ),
      );

      it('should render the component', () => {
        cy.skyReady('app-code-block');
        cy.get('#screenshot-wrapper')
          .should('exist')
          .should('be.visible')
          .screenshot(`code-block-${theme}`);
        cy.percySnapshot(`code-block-${theme}`, {
          scope: '#screenshot-wrapper',
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
