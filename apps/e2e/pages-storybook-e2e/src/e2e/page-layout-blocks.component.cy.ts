import { E2eVariations } from '@skyux-sdk/e2e-schematics';

const ID = 'blockspagecomponent-blockspage--blocks-page';

describe(`pages-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(`/iframe.html?globals=theme:${theme}&id=${ID}`)
      );
      it('should render the component', () => {
        cy.get('app-blocks-page sky-page')
          .should('exist')
          .should('be.visible')
          .screenshot(`${ID}-${theme}`)
          .percySnapshot(`${ID}-${theme}`);
      });

      it('should render the component on mobile', () => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);

        cy.get('app-blocks-page sky-page')
          .should('exist')
          .should('be.visible')
          .screenshot(`${ID}-${theme}-mobile`)
          .percySnapshot(`${ID}-${theme}-mobile`, {
            widths: E2eVariations.MOBILE_WIDTHS,
          });
      });
    });
  });
});
