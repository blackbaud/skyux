import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook - text expand repeater', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=textexpandrepeatercomponent-textexpandrepeater--text-expand-repeater`,
        ),
      );
      it('should render the component', () => {
        cy.get('.sky-text-expand-repeater-see-more').last().click();

        cy.get('app-text-expand-repeater')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `textexpandrepeatercomponent-textexpandrepeater--text-expand-repeater-${theme}`,
          );
        cy.percySnapshot(
          `textexpandrepeatercomponent-textexpandrepeater--text-expand-repeater-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  }, true);
});
