import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('inline delete', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=inlinedeletecomponent-inlinedelete--inline-delete`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-inline-delete');
        cy.get('app-inline-delete')
          .end()
          .get('body')
          .screenshot(`inline-delete-${theme}`);
        cy.get('body').percySnapshot(`inline-delete-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
