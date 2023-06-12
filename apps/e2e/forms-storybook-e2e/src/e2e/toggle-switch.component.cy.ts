import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook - toggle switch', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=toggleswitchcomponent-toggleswitch--toggle-switch`
        )
      );
      it('should render the component', () => {
        cy.get('app-toggle-switch')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `toggleswitchcomponent-toggleswitch--toggle-switch-${theme}`
          )
          .percySnapshot(
            `toggleswitchcomponent-toggleswitch--toggle-switch-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
