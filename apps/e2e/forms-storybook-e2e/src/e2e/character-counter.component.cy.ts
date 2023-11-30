import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('character-counter', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(E2eVariations.MOBILE_WIDTHS[0], 1600)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=charactercountercomponent-charactercounter--character-counter`
          )
      );
      it('should render the component', () => {
        cy.get('app-character-counter')
          .should('exist')
          .should('be.visible')
          .end()
          .get('#ready')
          .should('exist')
          .end()
          .get('#screenshot-character-count-input-box-invalid input')
          .focus()
          .blur()
          .end()
          .get('body')
          .screenshot(`character-counter-${theme}`, {
            disableTimersAndAnimations: true,
            overwrite: true,
          })
          .percySnapshot(`character-counter-${theme}`, {
            widths: E2eVariations.MOBILE_WIDTHS,
          });
      });
    });
  });
});
