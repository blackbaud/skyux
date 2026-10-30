import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Code', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(`/iframe.html?globals=theme:${theme}&id=codecomponent--code`),
      );

      it('should render the component', () => {
        cy.skyReady('app-code');
        cy.get('app-code')
          .should('exist')
          .should('be.visible')
          .screenshot(`code-${theme}`);
        cy.percySnapshot(`code-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
