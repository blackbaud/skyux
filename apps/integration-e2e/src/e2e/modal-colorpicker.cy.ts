import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Modal Colorpicker', () => {
  E2eVariations.forEachTheme((theme) => {
    [768, 500].forEach((height) => {
      it(`should fit colorpicker into the 900x${height} viewport and buttons should be clickable`, () => {
        cy.viewport(900, height)
          .visit('/')
          .skyChooseTheme(theme)
          .get('a[href="#/integrations/modal-colorpicker"]')
          .click();
        cy.url()
          .should('include', '#/integrations/modal-colorpicker')
          .get('app-modal-colorpicker button:first-of-type')
          .should('be.visible')
          .should('contain.text', 'Open modal')
          .click();
        cy.get('sky-modal button[aria-haspopup="dialog"]:not([disabled])')
          .should('exist')
          .should('have.length', 3);
        cy.get('#colorpicker-6-presets-sky-icon button[aria-haspopup="dialog"]')
          .scrollIntoView()
          .should('be.visible')
          .click({ waitForAnimations: true })
          .end()
          .get('.sky-colorpicker-container[role="dialog"]')
          .should('exist')
          .should('be.visible')
          .end()
          .get(
            '.sky-colorpicker-container[role="dialog"] button.sky-btn-colorpicker-apply',
          )
          .should('exist')
          .scrollIntoView()
          .should('be.visible')
          .end()
          .get(
            '.sky-colorpicker-container[role="dialog"] button.sky-btn-colorpicker-close',
          )
          .should('exist')
          .scrollIntoView()
          .should('be.visible')
          .click({ waitForAnimations: true })
          .end()
          .get(
            '#colorpicker-default-presets-no-clear-btn button[aria-haspopup="dialog"]',
          )
          .scrollIntoView()
          .should('be.visible')
          .click({ waitForAnimations: true })
          .end()
          .get('.sky-colorpicker-container[role="dialog"]')
          .should('exist')
          .should('be.visible')
          .end()
          .get(
            '.sky-colorpicker-container[role="dialog"] button.sky-btn-colorpicker-apply',
          )
          .should('exist')
          .scrollIntoView()
          .should('be.visible')
          .end()
          .get(
            '.sky-colorpicker-container[role="dialog"] button.sky-btn-colorpicker-close',
          )
          .should('exist')
          .scrollIntoView()
          .should('be.visible')
          .click({ waitForAnimations: true })
          .end()
          .get('#colorpicker-12-presets-fa-icon button[aria-haspopup="dialog"]')
          .scrollIntoView()
          .should('be.visible')
          .click({ waitForAnimations: true })
          .end()
          .get('.sky-colorpicker-container[role="dialog"]')
          .should('exist')
          .should('be.visible')
          .end()
          .get(
            '.sky-colorpicker-container[role="dialog"] button.sky-btn-colorpicker-apply',
          )
          .should('exist')
          .scrollIntoView()
          .should('be.visible')
          .end()
          .get(
            '.sky-colorpicker-container[role="dialog"] button.sky-btn-colorpicker-close',
          )
          .should('exist')
          .scrollIntoView()
          .should('be.visible')
          .click({ waitForAnimations: true });
      });
    });
  });
});
