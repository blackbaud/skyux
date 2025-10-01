import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook - chevron', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=chevroncomponent-chevron--chevron`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-chevron').screenshot(
          `chevroncomponent-chevron--chevron-${theme}`,
        );
        cy.get('app-chevron').percySnapshot(
          `chevroncomponent-chevron--chevron-${theme}`,
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
