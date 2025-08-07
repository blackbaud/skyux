import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('field heights', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 1200)
          .visit('/')
          .skyChooseTheme(theme)
          .contains('Field Heights')
          .should('be.visible')
          .click();
      });

      it('should match heights across different field types', () => {
        cy.skyReady('app-field-heights', ['#ready'])
          .end()
          .get('app-field-heights .sky-input-box')
          .should('have.length.gte', 2)
          .then((els) => {
            const heights = new Set();

            els.each((_i, el) => {
              if (el.clientHeight > 0) {
                heights.add(el.clientHeight);
              }
            });

            console.log(`Heights: ${Array.from(heights).join(', ')}`);
            expect(heights.size).to.equal(1);
          });
        cy.skyVisualTest(`field-heights-${theme}`);
      });
    });
  }, false);
});
