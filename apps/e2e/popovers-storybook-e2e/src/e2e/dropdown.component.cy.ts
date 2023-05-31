import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('popovers-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['default', 'primary', 'link', 'disabled'].forEach((buttonStyle) => {
        describe(`${buttonStyle} button`, () => {
          beforeEach(() => {
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=dropdowncomponent-dropdown--dropdown-${buttonStyle}-button`
            );
          });
          it('should render the dropdown button', () => {
            cy.get('app-dropdown')
              .should('exist')
              .should('be.visible')
              .screenshot(
                `dropdowncomponent-dropdown--dropdown-${buttonStyle}-button-${theme}`
              )
              .percySnapshot(
                `dropdowncomponent-dropdown--dropdown-${buttonStyle}-button-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                }
              );
          });
        });
      });
    });
  });
});
