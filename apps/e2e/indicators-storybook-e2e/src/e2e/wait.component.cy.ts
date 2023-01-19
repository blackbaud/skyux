import { E2eVariations } from '@skyux-sdk/e2e-schematics';

/* spell-checker:ignore waitcomponent */
describe('indicators-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      describe('element and nonBlocking waits', () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=waitcomponent-wait--wait`
          )
        );
        it('should render the component', () => {
          cy.get('app-wait')
            .should('exist')
            .should('be.visible')
            .screenshot(`waitcomponent-wait--wait-${theme}`)
            .percySnapshot(`waitcomponent-wait--wait-${theme}`, {
              widths: E2eVariations.DISPLAY_WIDTHS,
            });
        });
      });

      describe('page blocking wait', () => {
        beforeEach(() =>
          cy.visit(
            `/iframe.html?globals=theme:${theme}&id=waitcomponent-wait--wait-page-blocking`
          )
        );
        it('should render the component', () => {
          cy.get('app-wait')
            .should('exist')
            .should('be.visible')
            .screenshot(`waitcomponent-wait--wait-page-blocking-${theme}`)
            .percySnapshot(`waitcomponent-wait--wait-page-blocking-${theme}`, {
              widths: E2eVariations.DISPLAY_WIDTHS,
            });
        });
      });
    });
  });
});
