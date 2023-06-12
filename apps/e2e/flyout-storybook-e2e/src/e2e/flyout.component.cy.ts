import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('flyout-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    beforeEach(() => {
      cy.viewport(1300, 900);
    });

    describe(`in ${theme} theme`, () => {
      [
        'standard',
        'header-buttons',
        'responsive-xs',
        'responsive-sm',
        'responsive-md',
        'responsive-lg',
      ].forEach((style) => {
        it(`should render the component (${style})`, () => {
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=flyoutcomponent-flyout--flyout-${style}`
          );
          cy.get('#ready').should('exist').end();

          cy.get('.sky-flyout .sky-flyout-content')
            .should('exist')
            .should('be.visible')
            .click()
            .end();

          if (style.includes('responsive')) {
            cy.get(
              `.sky-responsive-container-${style.substring(
                style.lastIndexOf('-') + 1
              )}`
            ).should('exist');
          }

          cy.get('app-flyout')
            .should('exist')
            .should('be.visible')
            .screenshot(`flyoutcomponent-flyout--flyout-${style}-${theme}`, {
              capture: 'fullPage',
            })
            .percySnapshot(`flyoutcomponent-flyout--flyout-${style}-${theme}`, {
              enableJavaScript: true,
              widths: E2eVariations.DISPLAY_WIDTHS,
            });
        });
      });
    });
  });
});
