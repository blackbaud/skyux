import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['states', 'image', 'file'].forEach((mode) => {
        describe(`for single file attachment ${mode}`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=singlefileattachmentcomponent-singlefileattachment--single-file-attachment-${mode}`
            )
          );
          it('should render the single file attachment component', () => {
            cy.get('app-single-file-attachment')
              .should('exist')
              .should('be.visible')
              .screenshot(
                `singlefileattachmentcomponent-singlefileattachment--single-file-attachment-${mode}-${theme}`
              )
              .percySnapshot(
                `singlefileattachmentcomponent-singlefileattachment--single-file-attachment-${mode}-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                }
              );
          });
        });
      });
    });
  });
});
