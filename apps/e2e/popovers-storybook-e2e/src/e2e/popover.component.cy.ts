import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`popovers-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(1280, 1600)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=popovercomponent-popover--popover`,
          ),
      );
      it('should render the component', () => {
        cy.skyReady('app-popover', ['#popovers-ready']);

        cy.get('.popover-message')
          .should('exist')
          .should('be.visible')
          .should('have.length', 16);

        cy.get('sky-popover-content > div.sky-popover-container')
          .should('exist')
          .eq(12)
          .should('be.visible')
          .should('have.class', 'sky-popover-placement-above');

        cy.get('sky-popover-content > div.sky-popover-container')
          .should('exist')
          .eq(13)
          .should('be.visible')
          .should('have.class', 'sky-popover-placement-below');

        cy.get('sky-popover-content > div.sky-popover-container')
          .should('exist')
          .eq(14)
          .should('be.visible')
          .should('have.class', 'sky-popover-placement-right');

        cy.get('sky-popover-content > div.sky-popover-container')
          .should('exist')
          .eq(15)
          .should('be.visible')
          .should('have.class', 'sky-popover-placement-left');

        cy.get('.popover-message').should('have.length', 16);
        cy.get('.popover-message').should(
          'contain.text',
          'The content of a popover can be text, HTML, or Angular components.',
        );

        cy.skyVisualTest(`popovercomponent-popover--popover-${theme}`, {
          capture: 'fullPage',
          overwrite: true,
          disableTimersAndAnimations: true,
        });
      });
    });
  });
});
