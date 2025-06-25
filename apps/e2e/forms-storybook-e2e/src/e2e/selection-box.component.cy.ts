import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('forms-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=selectionboxcomponent-selectionbox--selection-box`,
        ),
      );
      E2eVariations.DISPLAY_WIDTHS.concat(E2eVariations.MOBILE_WIDTHS).forEach(
        (width) => {
          it(`should render the component - ${width}`, () => {
            cy.viewport(width, 1200);
            cy.skyReady('app-selection-box');
            cy.get('app-selection-box').then((el) => {
              el
                .get(0)
                .ownerDocument.defaultView?.dispatchEvent(new Event('resize'));
            });

            cy.get('app-selection-box label.sky-selection-box')
              .should('exist')
              .should('be.visible')
              .should('have.length', 6)
              .then((el) => {
                el.each((_, box) => {
                  cy.wrap(Cypress.$(box).outerHeight()).should('be.gte', 75);
                });
              });

            cy.get('app-selection-box sky-selection-box-header')
              .should('contain.text', 'Icon')
              .should('contain.text', 'No icon')
              .should('contain.text', 'Icon no description')
              .should('contain.text', 'No icon no description')
              .should('contain.text', 'Disabled');

            cy.window().screenshot(
              `selectionboxcomponent-selectionbox--selection-box-${theme}${E2eVariations.DISPLAY_WIDTHS.includes(width) ? '' : '-mobile'}`,
            );
            cy.window().percySnapshot(
              `selectionboxcomponent-selectionbox--selection-box-${theme}${E2eVariations.DISPLAY_WIDTHS.includes(width) ? '' : '-mobile'}`,
              {
                widths: [width],
              },
            );
          });
        },
      );
    });
  });
});
