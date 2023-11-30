import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('text-editor-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['basic', 'disabled', 'inline-help'].forEach((mode) => {
        describe(`the ${mode} text editor component`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=texteditorcomponent-texteditor--text-editor-${mode}`,
            ),
          );
          it('should render', () => {
            cy.get('app-text-editor')
              .should('exist')
              .should('be.visible')
              .screenshot(
                `texteditorcomponent-texteditor--text-editor-${mode}-${theme}`,
              )
              .percySnapshot(
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
          cy.get('app-text-editor')
            .should('exist')
            .should('be.visible')
            .get('iframe')
            .then(($iframe) => {
              const $bodyWrapper = $iframe.contents().find('body');
              cy.wrap($bodyWrapper)
                .click()
                .type('This is what the text looks like');
            })
            .screenshot(
              `texteditorcomponent-texteditor--text-editor-with-text-${theme}`,
            )
            .percySnapshot(
              `texteditorcomponent-texteditor--text-editor-with-text-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              },
            );
        });
        it('should open all the menus', () => {
          ['Edit menu', 'Format menu', 'Insert merge field'].forEach(
            (button) => {
              cy.get('app-text-editor')
                .should('exist')
                .should('be.visible')
                .get(`[aria-label="${button}"]`)
                .click()
                .screenshot(
                  `texteditorcomponent-texteditor--text-editor-${button}-open-${theme}`,
                )
                .percySnapshot(
                  `texteditorcomponent-texteditor--text-editor-${button}-open-${theme}`,
                  {
                    widths: E2eVariations.DISPLAY_WIDTHS,
                  },
                );
            },
          );
        });
        it('should open create link dialog', () => {
          cy.get('app-text-editor')
            .should('exist')
            .should('be.visible')
            .get('[title="Link"]')
            .click()
            .end();
          cy.get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .screenshot(
              `texteditorcomponent-texteditor--text-editor-create-link-modal-web-page-tab-${theme}`,
            )
            .percySnapshot(
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
            .click()
            .screenshot(
              `texteditorcomponent-texteditor--text-editor-create-link-modal-email-address-tab-${theme}`,
            )
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
