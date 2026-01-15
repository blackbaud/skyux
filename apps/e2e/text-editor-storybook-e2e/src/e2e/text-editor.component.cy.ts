import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('text-editor-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      // TODO: Add inline help tests back when inline help functionality is added to label.
      ['basic', 'disabled'].forEach((mode) => {
        describe(`the ${mode} text editor component`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=texteditorcomponent-texteditor--text-editor-${mode}`,
            ),
          );

          it('should render', () => {
            cy.skyReady('app-text-editor').screenshot(
              `texteditorcomponent-texteditor--text-editor-${mode}-${theme}`,
            );
            cy.get('app-text-editor').percySnapshot(
              `texteditorcomponent-texteditor--text-editor-${mode}-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              },
            );
          });
        });
      });

      describe('text editor component', () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=texteditorcomponent-texteditor--text-editor-basic`,
          ),
        );
        it('should display entered text', () => {
          cy.skyReady('app-text-editor')
            .get('iframe')
            .then(($iframe) => {
              const $bodyWrapper = $iframe.contents().find('body');
              cy.wrap($bodyWrapper).click();
              cy.wrap($bodyWrapper).type('This is what the text looks like');
            })
            .screenshot(
              `texteditorcomponent-texteditor--text-editor-with-text-${theme}`,
            );
          cy.get('app-text-editor').percySnapshot(
            `texteditorcomponent-texteditor--text-editor-with-text-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
        });

        it('should display an error state', () => {
          cy.skyReady('app-text-editor')
            .get('iframe')
            .then(($iframe) => {
              const $bodyWrapper = $iframe.contents().find('body');
              cy.wrap($bodyWrapper).click();
              cy.wrap($bodyWrapper).blur();
            });
          cy.get('app-text-editor sky-form-error').should('be.visible');
          cy.get('app-text-editor').screenshot(
            `texteditorcomponent-texteditor--text-editor-with-error-${theme}`,
          );
          cy.get('app-text-editor').percySnapshot(
            `texteditorcomponent-texteditor--text-editor-with-error-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
        });

        it('should open all the menus', () => {
          cy.skyReady('app-text-editor')
            .get('iframe')
            .then(($iframe) => {
              const $bodyWrapper = $iframe.contents().find('body');
              cy.wrap($bodyWrapper).click();
              cy.wrap($bodyWrapper).type('Some text');
            });

          ['Edit menu', 'Format menu', 'Insert merge field'].forEach(
            (button) => {
              cy.get('app-text-editor')
                .should('exist')
                .should('be.visible')
                .get(`[aria-label="${button}"]`)
                .click();
              cy.get('app-text-editor').screenshot(
                `texteditorcomponent-texteditor--text-editor-${button}-open-${theme}`,
              );
              cy.get('app-text-editor').percySnapshot(
                `texteditorcomponent-texteditor--text-editor-${button}-open-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                },
              );
            },
          );
        });

        it('should open create link dialog', () => {
          cy.skyReady('app-text-editor')
            .get('iframe')
            .then(($iframe) => {
              const $bodyWrapper = $iframe.contents().find('body');
              cy.wrap($bodyWrapper).click();
              cy.wrap($bodyWrapper).type('Some text');
            });

          cy.get('app-text-editor')
            .should('exist')
            .should('be.visible')
            .get('[title="Link"]')
            .click();
          cy.get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .screenshot(
              `texteditorcomponent-texteditor--text-editor-create-link-modal-web-page-tab-${theme}`,
            );
          cy.get('.sky-modal').percySnapshot(
            `texteditorcomponent-texteditor--text-editor-create-link-modal-web-page-tab-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            },
          );
          cy.get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .get('sky-tab-button')
            .eq(1)
            .click();
          cy.get('.sky-modal sky-tab-button')
            .first()
            .screenshot(
              `texteditorcomponent-texteditor--text-editor-create-link-modal-email-address-tab-${theme}`,
            );
          cy.get('.sky-modal sky-tab-button')
            .first()
            .percySnapshot(
              `texteditorcomponent-texteditor--text-editor-create-link-modal-email-address-tab-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              },
            );
        });
      });
    });
  });
});
