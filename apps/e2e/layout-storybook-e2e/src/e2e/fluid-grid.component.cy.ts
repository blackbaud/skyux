import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook - fluid-grid', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      E2eVariations.RESPONSIVE_WIDTHS.forEach((width) => {
        describe(`at ${width}px`, () => {
          beforeEach(() => {
            cy.viewport(width, 960);
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=fluidgridcomponent-fluidgrid--fluid-grid`,
            );
          });

          it(`should render the component at width ${width}`, () => {
            cy.skyReady('app-fluid-grid').screenshot(
              `fluidgridcomponent-fluidgrid--fluid-grid-${theme}-${width}`,
            );
            cy.percySnapshot(
              `fluidgridcomponent-fluidgrid--fluid-grid-${theme}-${width}`,
              {
                widths: [width],
              },
            );
          });
        });
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
