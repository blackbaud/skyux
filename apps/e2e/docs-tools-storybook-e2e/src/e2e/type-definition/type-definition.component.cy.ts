import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Type definition', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      for (const story of [
        'type-definition-directive',
        'type-definition-service',
        'type-definition-other',
      ]) {
        it(`should render the ${story} story`, () => {
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=type-definitioncomponent--${story}`,
          );
          cy.skyReady('app-type-definition');
          cy.get('#screenshot-wrapper')
            .should('exist')
            .should('be.visible')
            .screenshot(`${story}-${theme}`);
          cy.percySnapshot(`${story}-${theme}`, {
            scope: '#screenshot-wrapper',
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
        });
      }
    });
  });
});
