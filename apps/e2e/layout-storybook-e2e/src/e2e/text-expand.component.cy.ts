import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(1280, 900)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=textexpandcomponent-textexpand--text-expand`
          )
      );
      it('should render the component', () => {
        cy.get('.sky-text-expand-see-more')
          .first()
          .click()
          .end()
          .get('.sky-text-expand-see-more')
          .last()
          .click()
          .get('app-text-expand')
          .should('exist')
          .should('be.visible')
          .screenshot(`textexpandcomponent-textexpand--text-expand-${theme}`)
          .percySnapshot(
            `textexpandcomponent-textexpand--text-expand-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
