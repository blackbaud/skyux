import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('theme-storybook', () => {
  const theme = 'default';

  E2eVariations.RESPONSIVE_WIDTHS.forEach((width) => {
    describe(`at ${width}px`, () => {
      beforeEach(() => {
        cy.viewport(width, 1400);
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=responsivecomponent-responsive--responsive`
        );
      });
      it('should render the component', () => {
        cy.get('.resize-observer-examples')
          .should('exist')
          .should('be.visible')
          .end()
          .get('.container-queries-examples')
          .should('exist')
          .should('be.visible')
          .end()
          .document()
          .screenshot(`responsivecomponent-responsive--responsive-${theme}`)
          .percySnapshot(
            `responsivecomponent-responsive--responsive-${theme}`,
            {
              widths: [width],
            }
          );
      });
    });
  });
});
