import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('dropdown-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['default', 'primary', 'link', 'disabled'].forEach((buttonStyle) => {
        it(`should render ${buttonStyle} style dropdown buttons`, () => {
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=dropdowncomponent-dropdown--dropdown-${buttonStyle}-button`,
          );
          cy.skyReady('app-dropdown').screenshot(
            `dropdowncomponent-dropdown--dropdown-${buttonStyle}-button-${theme}`,
          );
          cy.get('app-dropdown').percySnapshot(
            `dropdowncomponent-dropdown--dropdown-${buttonStyle}-button-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
        });
      });

      ['left', 'center', 'right'].forEach((horizontalAlignment) => {
        describe(`${horizontalAlignment} aligned dropdown menu`, () => {
          beforeEach(() => {
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=dropdowncomponent-dropdown--dropdown-${horizontalAlignment}-aligned`,
            );
          });

          ['select', 'context-menu', 'tab', 'custom'].forEach((buttonType) => {
            it(`should open the ${buttonType} style dropdown's menu`, () => {
              cy.skyReady('app-dropdown');
              cy.get(
                buttonType === 'custom'
                  ? '.custom-trigger'
                  : `.sky-dropdown-button-type-${buttonType}`,
              )
                .last()
                .should('exist')
                .should('be.visible')
                .click();

              cy.get('.sky-dropdown-menu')
                .should('exist')
                .should('be.visible')
                .screenshot(
                  `dropdowncomponent-dropdown--dropdown-${buttonType}-button-${horizontalAlignment}-algnment-${theme}`,
                );
              cy.get('.sky-dropdown-menu').percySnapshot(
                `dropdowncomponent-dropdown--dropdown-${buttonType}-button-${horizontalAlignment}-algnment-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                },
              );
            });
          });
        });
      });
    });
  });
});
