import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook - single file attachment', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=singlefileattachmentcomponent-singlefileattachment--single-file-attachment`,
        ),
      );
      it('should render the single file attachment component', () => {
        cy.get('app-single-file-attachment')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `singlefileattachmentcomponent-singlefileattachment--single-file-attachment-${theme}`,
          )
          .percySnapshot(
            `singlefileattachmentcomponent-singlefileattachment--single-file-attachment-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
      });
    });
  });
});
