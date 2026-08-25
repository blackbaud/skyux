import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('tiles-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      E2eVariations.RESPONSIVE_WIDTHS.forEach((width) => {
        describe(`at ${width}px`, () => {
          beforeEach(() => {
            cy.viewport(width, 960);
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=tiledashboardcomponent-tiledashboard--tile-dashboard`,
            );
          });

          it('should render the component', () => {
            cy.skyReady('app-tile-dashboard', ['.ready']).screenshot(
              `tile-dashboard-${theme}-${width}px`,
              {
                overwrite: true,
              },
            );
            cy.get('app-tile-dashboard').percySnapshot(
              `tile dashboard ${theme} ${width}px`,
              {
                widths: [width],
              },
            );
          });
        });
      });
    });
  });
});
