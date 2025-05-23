import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('lists-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=repeatercomponent-repeater--repeater`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-repeater').screenshot(
          `repeatercomponent-repeater--repeater-${theme}`,
        );
        cy.get('app-repeater').percySnapshot(
          `repeatercomponent-repeater--repeater-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
