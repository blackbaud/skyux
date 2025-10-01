import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=boxcomponent-box--box&args=showHelp:false;`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-box').screenshot(`boxcomponent-box--box-${theme}`);
        cy.get('app-box').percySnapshot(`boxcomponent-box--box-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
