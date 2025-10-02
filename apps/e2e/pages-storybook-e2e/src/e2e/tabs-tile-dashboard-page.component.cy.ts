import { E2eVariations } from '@skyux-sdk/e2e-schematics';

const ID = 'tabs-tile-dashboard-pagecomponent--tabs-tile-dashboard-page';

const SELECTOR_PAGE = 'app-tabs-tile-dashboard-page';

describe(`pages-storybook-tabs-tile-dashboard`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      E2eVariations.RESPONSIVE_WIDTHS.forEach((width) => {
        describe(`at ${width}px`, () => {
          beforeEach(() => {
            cy.viewport(width, 960);
            cy.visit(`/iframe.html?globals=theme:${theme}&id=${ID}`);
          });

          it('should render the component', () => {
            cy.skyReady(SELECTOR_PAGE).screenshot(`${ID}-${theme}`);
            cy.get(SELECTOR_PAGE).percySnapshot(`${ID}-${theme}`);
          });
        });
      });
    });
  });
});
