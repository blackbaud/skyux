import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`tabs-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=wizardcomponent-wizard--wizard`
        )
      );
      it('should render the component on a large screen', () => {
        cy.get('app-wizard')
          .should('exist')
          .should('be.visible')
          .get('.open-wizard-btn')
          .should('exist')
          .should('be.visible')
          .click()
          .get('.sky-modal')
          .should('exist')
          .should('be.visible')
          .screenshot(`wizardcomponent-wizard--wizard-lg-${theme}`)
          .percySnapshot(`wizardcomponent-wizard--wizard-lg-${theme}`, {
            widths: [1280],
          });
      });

      it('should render the component on a small screen', () => {
        cy.viewport(375, 812)
          .get('app-wizard')
          .should('exist')
          .should('be.visible')
          .get('.open-wizard-btn')
          .should('exist')
          .should('be.visible')
          .click()
          .get('.sky-modal')
          .should('exist')
          .should('be.visible')
          .get('sky-dropdown')
          .should('exist')
          .should('be.visible')
          .screenshot(`wizardcomponent-wizard--wizard-sm-${theme}`)
          .percySnapshot(`wizardcomponent-wizard--wizard-sm-${theme}`, {
            widths: [375],
          });
      });
    });
  });
});
