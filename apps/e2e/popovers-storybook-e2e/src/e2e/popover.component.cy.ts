import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`popovers-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy
          .viewport(1280, 1500)
          .visit(
            `/iframe.html?globals=theme:${theme}&id=popovercomponent-popover--popover`,
          ),
      );
      it('should render the component', () => {
        cy.get('#popovers-ready').should('exist');

        cy.get('.popover-message')
          .should('exist')
          .should('be.visible')
          .should('have.length', 16);

        cy.get('sky-popover-content > div.sky-popover-container')
          .should('exist')
          .eq(12)
          .should('be.visible')
          .should('have.class', 'sky-popover-placement-above')
          .then(($el) => {
            cy.wrap($el.position().left).should('equal', 12);
            cy.wrap($el.position().top).should('be.approximately', 580, 50);
          });

        cy.get('sky-popover-content > div.sky-popover-container')
          .should('exist')
          .eq(13)
          .should('be.visible')
          .should('have.class', 'sky-popover-placement-below')
          .then(($el) => {
            cy.wrap($el.position().left).should('equal', 312);
            cy.wrap($el.position().top).should('be.approximately', 580, 50);
          });

        cy.get('sky-popover-content > div.sky-popover-container')
          .should('exist')
          .eq(14)
          .should('be.visible')
          .should('have.class', 'sky-popover-placement-right')
          .then(($el) => {
            cy.wrap($el.position().left).should('equal', 610);
            cy.wrap($el.position().top).should('be.approximately', 580, 50);
          });

        cy.get('sky-popover-content > div.sky-popover-container')
          .should('exist')
          .eq(15)
          .should('be.visible')
          .should('have.class', 'sky-popover-placement-left')
          .then(($el) => {
            cy.wrap($el.position().left).should('equal', 914);
            cy.wrap($el.position().top).should('be.approximately', 580, 50);
          });

        cy.get('.popover-message').should('have.length', 16);
        cy.get('.popover-message').should(
          'contain.text',
          'The content of a popover can be text, HTML, or Angular components.',
        );

        cy.window().percySnapshot(
          `popovercomponent-popover--popover-${theme}`,
          {
            widths: [1280],
          },
        );
        cy.window().screenshot(`popovercomponent-popover--popover-${theme}`);
      });
    });
  }, true);
});
