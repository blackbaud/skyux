import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('modals-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=modalcomponent-modal--modal`
        )
      );
      it('should render the component', () => {
        cy.get('app-modal')
          .should('exist')
          .should('be.visible')
          .screenshot(`modalcomponent-modal--modal-${theme}`)
          .percySnapshot(`modalcomponent-modal--modal-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
