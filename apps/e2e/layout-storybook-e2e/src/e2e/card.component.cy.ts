import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook - card', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=cardcomponent-card--card`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-card').screenshot(`cardcomponent-card--card-${theme}`);
        cy.get('app-card').percySnapshot(`cardcomponent-card--card-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
