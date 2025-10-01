import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=statusindicatorcomponent-statusindicator--status-indicator`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-status-indicator').screenshot(
          `statusindicatorcomponent-statusindicator--status-indicator-${theme}`,
        );
        cy.get('app-status-indicator').percySnapshot(
          `statusindicatorcomponent-statusindicator--status-indicator-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
