import { E2eVariations } from '@skyux-sdk/e2e-schematics';

const viewportHeight = 900;

describe('modal footer dropdown', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() => {
        cy.viewport(E2eVariations.DISPLAY_WIDTHS[0], viewportHeight)
          .visit('/')
          .skyChooseTheme(theme)
          .contains('Dropdown in Modal Footer')
          .should('be.visible')
          .click();
      });

      it('should show the modal footer dropdown below the modal footer in a medium modal', () => {
        cy.skyReady('app-modal-footer-dropdown');
        cy.get('app-modal-footer-dropdown .space + div button')
          .should('exist')
          .first()
          .scrollIntoView();
        cy.get('app-modal-footer-dropdown .space + div button')
          .should('be.visible')
          .should('contain.text', 'Open medium modal')
          .first()
          .click({ waitForAnimations: true });
        cy.get('sky-modal h2')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Dropdown footer');
        cy.get('sky-modal sky-dropdown button')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Menu')
          .click({ waitForAnimations: true });
        cy.get('sky-dropdown-menu button')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Item 2');
        cy.get('sky-dropdown-menu button')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Item 10');
        cy.get('sky-modal sky-dropdown button')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Menu');
        cy.skyVisualTest(`modal-footer-dropdown-${theme}--medium`, {
          clip: {
            height: viewportHeight,
            width: E2eVariations.DISPLAY_WIDTHS[0],
            x: 0,
            y: 0,
          },
          disableTimersAndAnimations: true,
        });
      });

      it('should show the modal footer dropdown above the modal footer in a full page modal', () => {
        cy.get('app-modal-footer-dropdown .space + div button')
          .should('exist')
          .last()
          .scrollIntoView();
        cy.get('app-modal-footer-dropdown .space + div button')
          .should('be.visible')
          .should('contain.text', 'Open full page modal')
          .last()
          .click({
            waitForAnimations: true,
          });
        cy.get('sky-modal h2')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Dropdown footer');
        cy.get('sky-modal sky-dropdown button')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Menu')
          .click({ waitForAnimations: true });
        cy.get('sky-dropdown-menu button')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Item 2');
        cy.get('sky-dropdown-menu button')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Item 10');
        cy.get('sky-modal sky-dropdown button')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Menu');
        cy.skyVisualTest(`modal-footer-dropdown-${theme}--full-page`, {
          clip: {
            height: viewportHeight,
            width: E2eVariations.DISPLAY_WIDTHS[0],
            x: 0,
            y: 0,
          },
          disableTimersAndAnimations: true,
        });
      });
    });
  }, false);
});
