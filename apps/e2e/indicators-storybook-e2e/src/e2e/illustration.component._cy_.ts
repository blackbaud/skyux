import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`indicators-storybook - illustration`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=illustrationcomponent-illustration--illustration`,
        ),
      );
      it('should render the component', () => {
        cy.get('app-illustration')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `illustrationcomponent-illustration--illustration-${theme}`,
          );
        cy.get('app-illustration').percySnapshot(
          `illustrationcomponent-illustration--illustration-${theme}`,
        );
      });
    });
  });
});
