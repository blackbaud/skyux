import { E2eVariations } from '@skyux-sdk/e2e-schematics';

const ID = 'listpagecomponent-listpage--list-page';

describe(`pages-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      [
        ['block-layout', ID],
        ['block-layout-with-links', `${ID}-with-links`],
      ].forEach(([_, ID]) => {
        describe(`${_}`, () => {
          beforeEach(() =>
            cy.visit(`/iframe.html?globals=theme:${theme}&id=${ID}`),
          );
          it('should render the component', () => {
            cy.skyReady('app-list-page sky-page');
            cy.window().screenshot(`${ID}-${theme}`);
            cy.window().percySnapshot(`${ID}-${theme}`);
          });
        });
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
