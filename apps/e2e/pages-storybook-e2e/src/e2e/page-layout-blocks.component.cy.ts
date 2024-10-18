import { E2eVariations } from '@skyux-sdk/e2e-schematics';

const ID = 'blockspagecomponent-blockspage--blocks-page';

// This is to mitigate a Cypress issue (https://github.com/cypress-io/cypress/issues/20341) where a ResizeObserver exception is thrown.
Cypress.on(
  'uncaught:exception',
  (err) =>
    !err.message.includes(
      'ResizeObserver loop completed with undelivered notifications',
    ),
);

describe(`pages-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      [
        ['block-layout', ID],
        ['block-layout-with-links', `${ID}-with-links`],
        ['block-layout-with-links-no-alert', `${ID}-with-links-no-alert`],
        ['block-layout-with-links-no-avatar', `${ID}-with-links-no-avatar`],
        [
          'block-layout-with-links-no-avatar-no-alert',
          `${ID}-with-links-no-avatar-no-alert`,
        ],
      ].forEach(([_, ID]) => {
        describe(`${_}`, () => {
          beforeEach(() =>
            cy.visit(`/iframe.html?globals=theme:${theme}&id=${ID}`),
          );

          it('should render the component', () => {
            cy.get('app-blocks-page sky-page')
              .should('exist')
              .should('be.visible');
            cy.window().screenshot(`${ID}-${theme}`);
            cy.window().percySnapshot(`${ID}-${theme}`);
          });

          it('should render the component on mobile', () => {
            cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);

            cy.get('app-blocks-page sky-page')
              .should('exist')
              .should('be.visible');
            cy.window().screenshot(`${ID}-${theme}-mobile`);
            cy.window().percySnapshot(`${ID}-${theme}-mobile`, {
              widths: E2eVariations.MOBILE_WIDTHS,
            });
          });
        });
      });
    });
  });
});
