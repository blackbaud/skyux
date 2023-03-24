import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('modals-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      describe(`basic modal`, () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=modalcomponent-modal--modal`
          )
        );
        it('should render the component', () => {
          cy.get('app-modal')
            .should('exist')
            .should('be.visible')
            .get('.open-modal-btn')
            .should('exist')
            .should('be.visible')
            .click()
            .get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .screenshot(`modalcomponent-modal--modal-${theme}`)
            .percySnapshot(`modalcomponent-modal--modal-${theme}`, {
              widths: E2eVariations.DISPLAY_WIDTHS,
            });
        });
      });
      describe(`full page modal`, () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=modalcomponent-modal--full-page-modal`
          )
        );
        it('should render the component', () => {
          cy.get('app-modal')
            .should('exist')
            .should('be.visible')
            .get('.open-modal-btn')
            .should('exist')
            .should('be.visible')
            .click()
            .get('.sky-modal')
            .should('exist')
            .should('be.visible')
            .screenshot(`modalcomponent-modal--full-page-modal-${theme}`)
            .percySnapshot(`modalcomponent-modal--full-page-modal-${theme}`, {
              widths: E2eVariations.DISPLAY_WIDTHS,
            });
        });
      });
    });
  });
});
