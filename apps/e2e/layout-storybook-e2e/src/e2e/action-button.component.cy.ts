import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook - action button', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=actionbuttoncomponent-actionbutton--action-button`
        )
      );
      it('should render the component on desktop', () => {
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('app-action-button')
          .should('exist')
          .should('be.visible')
          .wait(1000)
          .screenshot(
            `actionbuttoncomponent-actionbutton--action-button-${theme}`
          )
          .percySnapshot(
            `actionbuttoncomponent-actionbutton--action-button-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });

      it('should render the component on mobile', () => {
        cy.viewport(E2eVariations.MOBILE_WIDTHS[0], 800);
        cy.get('app-action-button')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `actionbuttoncomponent-actionbutton--action-button-${theme}-mobile`
          )
          .percySnapshot(
            `actionbuttoncomponent-actionbutton--action-button-${theme}-mobile`,
            {
              widths: E2eVariations.MOBILE_WIDTHS,
            }
          );
      });
    });
  });
});
