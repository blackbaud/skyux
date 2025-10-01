import { E2eVariations } from '@skyux-sdk/e2e-schematics';

const ID = 'blocks-tile-dashboard-pagecomponent--blocks-tile-dashboard-page';

const SELECTOR_PAGE = 'app-blocks-tile-dashboard-page';

describe(`pages-storybook-blocks-tile-dashboard`, () => {
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

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
