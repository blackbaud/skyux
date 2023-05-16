import { E2eVariations } from '@skyux-sdk/e2e-schematics';

const ID = 'boxpagecomponent-boxpage--box-page';

describe(`pages-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(`/iframe.html?globals=theme:${theme}&id=${ID}`)
      );
      it('should render the component', () => {
        cy.get('app-box-page sky-page')
          .should('exist')
          .should('be.visible')
          .screenshot(`${ID}-${theme}`)
          .percySnapshot(`${ID}-${theme}`);
      });
    });
  });
});
