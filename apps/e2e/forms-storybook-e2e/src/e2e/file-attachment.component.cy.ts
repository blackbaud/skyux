import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['basic', 'image-uploaded', 'no-preview'].forEach((mode) => {
        describe(`in ${mode} file attachment`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=fileattachmentcomponent-fileattachment--file-attachment-${mode}`,
            ),
          );
          it('should render the component', () => {
            cy.skyReady('app-file-attachment').screenshot(
              `fileattachmentcomponent-fileattachment--file-attachment-${mode}-${theme}`,
            );
            cy.get('app-file-attachment').percySnapshot(
              `fileattachmentcomponent-fileattachment--file-attachment-${mode}-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              },
            );
          });
        });
      });
      describe(`in file attachment`, () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=fileattachmentcomponent-fileattachment--file-attachment-basic`,
          ),
        );
        it(`should render component drag and drop`, () => {
          cy.skyReady('app-file-attachment');
          cy.get('.sky-file-drop-col')
            .first()
            .invoke('addClass', 'sky-file-drop-accept')
            .should('exist')
            .should('be.visible')
            .screenshot(
              `fileattachmentcomponent-fileattachment--file-attachment-drag-and-drop-${theme}`,
            );
          cy.get('.sky-file-drop-col').percySnapshot(
            `fileattachmentcomponent-fileattachment--file-attachment-drag-and-drop-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
        });
      });
    });
  });
});
