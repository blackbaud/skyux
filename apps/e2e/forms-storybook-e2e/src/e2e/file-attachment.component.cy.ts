import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=fileattachmentcomponent-fileattachment--file-attachment`
        )
      );
      it('should render the component', () => {
        cy.get('app-file-attachment')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `fileattachmentcomponent-fileattachment--file-attachment-${theme}`
          )
          .percySnapshot(
            `fileattachmentcomponent-fileattachment--file-attachment-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
