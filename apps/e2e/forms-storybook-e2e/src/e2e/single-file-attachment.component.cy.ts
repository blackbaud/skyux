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
        cy.skyReady('app-single-file-attachment');
        cy.get('sky-help-inline')
          .eq(1)
          .should('exist')
          .should('be.visible')
          .click();
        cy.get('app-single-file-attachment').screenshot(
          `singlefileattachmentcomponent-singlefileattachment--single-file-attachment-${theme}`,
        );
        cy.get('app-single-file-attachment').percySnapshot(
          `singlefileattachmentcomponent-singlefileattachment--single-file-attachment-${theme}`,
          {
            widths: E2eVariations.DISPLAY_WIDTHS,
          },
        );
      });
    });
  });
});
