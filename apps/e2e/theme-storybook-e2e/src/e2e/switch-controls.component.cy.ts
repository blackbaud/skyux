import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=switchcontrolscomponent-switchcontrols--switch-controls`,
        );
      });
      it('should render the component', () => {
        cy.get('app-switch-controls')
          .should('exist')
          .should('be.visible')
          .end()
          .document()
          .screenshot(
            `switchcontrolscomponent-switchcontrols--switch-controls-${theme}`,
          )
          .percySnapshot(
            `switchcontrolscomponent-switchcontrols--switch-controls-${theme}`,
            {
              widths: E2eVariations.MOBILE_WIDTHS,
            },
          );
      });
    });
  });
});
