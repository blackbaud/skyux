import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('sectioned form', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=sectionedformcomponent-sectionedform--sectioned-form`,
        ),
      );

      ['small', 'medium'].forEach((size) => {
        it(`should show in ${size} modal`, () => {
          cy.skyReady('app-sectioned-form')
            .end()
            .get(`#open-${size}-modal-button`)
            .click();

          cy.get(`#show-tabs-button`)
            .should('exist')
            .should('be.visible')
            .end()
            .window()
            .screenshot(`sectioned-form-${size}-${theme}-section`);
          cy.window().percySnapshot(`sectioned-form-${size}-${theme}-section`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
          cy.get(`#show-tabs-button`).click();

          cy.window().screenshot(`sectioned-form-${size}-${theme}-tab`);
          cy.window().percySnapshot(`sectioned-form-${size}-${theme}-tab`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
        });
      });

      it(`should show in large modal`, () => {
        const size = 'large';
        cy.skyReady('app-sectioned-form')
          .end()
          .get(`#open-${size}-modal-button`)
          .click();

        cy.get(`sky-sectioned-form-section[heading="Basic information"] a`)
          .should('exist')
          .should('be.visible')
          .click();

        cy.get('#inputName').should('exist').should('be.visible');

        cy.window().screenshot(`sectioned-form-${size}-${theme}`);
        cy.window().percySnapshot(`sectioned-form-${size}-${theme}`, {
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });
    });
  });
});
