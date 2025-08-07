import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('tiles-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=tiledashboardcomponent-tiledashboard--tile-dashboard`,
        ),
      );

      it('should render the component', () => {
        cy.skyReady('app-tile-dashboard', ['.ready']).screenshot(
          `tile-dashboard-${theme}-desktop`,
          {
            overwrite: true,
          },
        );
        cy.get('app-tile-dashboard').percySnapshot(
          `tile dashboard ${theme} desktop`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      it('should render the component in mobile', () => {
        cy.viewport('iphone-x', 'portrait');
        cy.skyReady('app-tile-dashboard', ['.ready']).screenshot(
          `tile-dashboard-${theme}-mobile`,
          {
            overwrite: true,
          },
        );
        cy.get('app-tile-dashboard').percySnapshot(
          `tile dashboard ${theme} mobile`,
          {
            widths: E2eVariations.MOBILE_WIDTHS,
          },
        );
      });
    });
  });
});
