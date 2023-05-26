import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('text-editor-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=texteditorcomponent-texteditor--text-editor`
        )
      );
      it('should render the component', () => {
        cy.get('app-text-editor')
          .should('exist')
          .should('be.visible')
          .screenshot(`texteditorcomponent-texteditor--text-editor-${theme}`)
          .percySnapshot(
            `texteditorcomponent-texteditor--text-editor-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
