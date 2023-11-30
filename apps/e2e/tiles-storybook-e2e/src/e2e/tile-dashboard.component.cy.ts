import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('tiles-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=tiledashboardcomponent-tiledashboard--tile-dashboard`
        )
      );

      it('should render the component', () => {
        cy.get('.ready')
          .should('exist')
          .end()
          .get('app-tile-dashboard')
          .should('exist')
          .should('be.visible')
          .screenshot(`tile-dashboard-${theme}-desktop`, {
            overwrite: true,
          })
          .get('app-tile-dashboard')
          .percySnapshot(`tile dashboard ${theme} desktop`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });

      it('should render the component in mobile', () => {
        cy.viewport('iphone-x', 'portrait');
        cy.get('.ready')
          .should('exist')
          .end()
          .get('app-tile-dashboard')
          .should('exist')
          .should('be.visible')
          .screenshot(`tile-dashboard-${theme}-mobile`, {
            overwrite: true,
          })
          .get('app-tile-dashboard')
          .percySnapshot(`tile dashboard ${theme} mobile`, {
            widths: E2eVariations.MOBILE_WIDTHS,
          });
      });
    });
  });
});
