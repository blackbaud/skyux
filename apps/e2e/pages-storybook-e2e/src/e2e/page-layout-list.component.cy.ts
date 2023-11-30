import { E2eVariations } from '@skyux-sdk/e2e-schematics';

const ID = 'listpagecomponent-listpage--list-page';

describe(`pages-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(`/iframe.html?globals=theme:${theme}&id=${ID}`)
      );
      it('should render the component', () => {
        cy.get('app-list-page sky-page')
          .should('exist')
          .should('be.visible')
          .screenshot(`${ID}-${theme}`)
          .percySnapshot(`${ID}-${theme}`);
      });
    });
  });
});
