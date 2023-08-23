import { E2eVariations } from '@skyux-sdk/e2e-schematics';

const ID = 'blockspagecomponent-blockspage--blocks-page';

// This is to mitigate a Cypress issue (https://github.com/cypress-io/cypress/issues/20341) where a ResizeObserver exception is thrown.
Cypress.on(
  'uncaught:exception',
  (err) => !err.message.includes('ResizeObserver loop limit exceeded')
);

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
