import { E2eVariations } from '@skyux-sdk/e2e-schematics';

const ID = 'fitpagecomponent-fitpage--fit-page';

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
            cy.skyReady('app-fit-page sky-page');
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
