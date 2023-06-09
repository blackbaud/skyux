import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('tabs-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=sectionedformcomponent-sectionedform--sectioned-form`
        )
      );

      ['small', 'medium'].forEach((size) => {
        it(`should show sectioned form in ${size} modal`, () => {
          cy.get('app-sectioned-form')
            .should('exist')
            .should('be.visible')
            .end()
            .get(`#open-${size}-modal-button`)
            .click()
            .end()
            .get(`#show-tabs-button`)
            .should('exist')
            .should('be.visible')
            .click()
            .end()
            .window()
            .screenshot(`sectioned-form-tabs-${size}-modal-${theme}`)
            .percySnapshot(`sectioned-form-tabs-${size}-modal-${theme}`, {
              widths: E2eVariations.DISPLAY_WIDTHS,
            });
        });
      });

      it(`should show sectioned form in large modal`, () => {
        const size = 'large';
        cy.get('app-sectioned-form')
          .should('exist')
          .should('be.visible')
          .end()
          .get(`#open-${size}-modal-button`)
          .click()
          .end()
          .get(`sky-sectioned-form-section[heading="Basic information"] a`)
          .should('exist')
          .should('be.visible')
          .click()
          .end()
          .get('#inputName')
          .should('exist')
          .should('be.visible')
          .end()
          .window()
          .screenshot(`sectioned-form-tabs-${size}-modal-${theme}`)
          .percySnapshot(`sectioned-form-tabs-${size}-modal-${theme}`, {
            widths: E2eVariations.DISPLAY_WIDTHS,
          });
      });
    });
  });
});
