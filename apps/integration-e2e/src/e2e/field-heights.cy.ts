import { E2eVariations } from '@skyux-sdk/e2e-schematics';

import { JG_THEME, forEachThemeAndBrand } from '../support/themes';

describe('field heights', () => {
  forEachThemeAndBrand((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], 1200);
      });

      it('should match heights across different field types', () => {
        cy.visit('/#/integrations/field-heights').skyChooseTheme(theme);
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

            // JustGiving field heights don't match yet.
            if (theme !== JG_THEME) {
              expect(heights.size).to.equal(1);
            }
          });
        cy.skyVisualTest(`field-heights-${theme}`);
      });

      it('should have all form controls disabled when disabled param is true', () => {
        cy.visit('/#/integrations/field-heights?disabled=true').skyChooseTheme(
          theme,
        );
        cy.skyReady('app-field-heights', ['#ready']);

        cy.get('textarea').each((input) => {
          cy.wrap(input).should('be.disabled');
        });

        cy.get('input').each((input) => {
          cy.wrap(input).should('be.disabled');
        });

        cy.skyVisualTest(`field-heights-disabled-${theme}`);
      });
    });
  });
});
