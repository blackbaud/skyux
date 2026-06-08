import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('character-counter', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(E2eVariations.MOBILE_WIDTHS[0], 1600)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=charactercountercomponent-charactercounter--character-counter`,
          ),
      );
      it('should render the component', () => {
        cy.skyReady('app-character-counter', ['#ready'])
          .end()
          .get('#screenshot-character-count-input-box-invalid input')
          .focus();
        cy.get('#screenshot-character-count-input-box-invalid input').blur();
        cy.get(
          '#screenshot-character-count-input-box-invalid sky-form-error',
        ).should('be.visible');

        cy.get('body').screenshot(`character-counter-${theme}`, {
          disableTimersAndAnimations: true,
          overwrite: true,
        });
        cy.get('body').percySnapshot(`character-counter-${theme}`, {
          widths: E2eVariations.MOBILE_WIDTHS,
        });
      });
    });
  });
});
