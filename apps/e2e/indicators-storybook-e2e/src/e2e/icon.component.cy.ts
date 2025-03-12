import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=iconcomponent-icon--icon`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-icon').screenshot(`iconcomponent-icon--icon-${theme}`);
        cy.get('app-icon').percySnapshot(`iconcomponent-icon--icon-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
