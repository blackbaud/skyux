import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('tabs-storybook - vertical tabs', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=verticaltabscomponent-verticaltabs--vertical-tabs`,
        ),
      );
      it('should render the vertical tabs on a large screen', () => {
        cy.skyReady('app-vertical-tabs').screenshot(
          `verticaltabscomponent-verticaltabs--vertical-tabs-${theme}`,
        );
        cy.get('app-vertical-tabs').percySnapshot(
          `verticaltabscomponent-verticaltabs--vertical-tabs-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });

      it('should render the vertical tabs content section on a mobile screen', () => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.skyReady('app-vertical-tabs')
          .get('#vertical-tabs-with-groups .sky-vertical-tabset-show-tabs-btn')
          .should('exist')
          .should('be.visible')
          .get(
            '#vertical-tabs-without-groups .sky-vertical-tabset-show-tabs-btn',
          )
          .should('exist')
          .should('be.visible')
          .get('#vertical-tabs-mixed .sky-vertical-tabset-show-tabs-btn')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `verticaltabscomponent-verticaltabs--vertical-tabs-mobile-content-section-${theme}`,
          );
        cy.get(
          '#vertical-tabs-with-groups .sky-vertical-tabset-show-tabs-btn',
        ).percySnapshot(
          `verticaltabscomponent-verticaltabs--vertical-tabs-mobile-content-section-${theme}`,
          {
            widths: E2eVariations.MOBILE_WIDTHS,
          },
        );
      });

      it('should render the vertical tabs tablist section on a mobile screen', () => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.skyReady('app-vertical-tabs')
          .get('#vertical-tabs-with-groups .sky-vertical-tabset-show-tabs-btn')
          .should('exist')
          .should('be.visible')
          .click();
        cy.get(
          '#vertical-tabs-without-groups .sky-vertical-tabset-show-tabs-btn',
        )
          .should('exist')
          .should('be.visible')
          .click();
        cy.get('#vertical-tabs-mixed .sky-vertical-tabset-show-tabs-btn')
          .should('exist')
          .should('be.visible')
          .click();
        cy.get(
          '#vertical-tabs-with-groups .sky-vertical-tabset-group-container',
        )
          .should('exist')
          .should('be.visible')
          .get(
            '#vertical-tabs-without-groups .sky-vertical-tabset-group-container',
          )
          .should('exist')
          .should('be.visible')
          .get('#vertical-tabs-mixed .sky-vertical-tabset-group-container')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `verticaltabscomponent-verticaltabs--vertical-tabs-mobile-tablist-section-${theme}`,
          );
        cy.get(
          '#vertical-tabs-without-groups .sky-vertical-tabset-group-container',
        ).percySnapshot(
          `verticaltabscomponent-verticaltabs--vertical-tabs-mobile-tablist-section-${theme}`,
          {
            widths: E2eVariations.MOBILE_WIDTHS,
          },
        );
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
