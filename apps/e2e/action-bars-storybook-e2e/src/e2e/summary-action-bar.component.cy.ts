import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('action-bars-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=summaryactionbarcomponent-summaryactionbar--summary-action-bar`
        )
      );
      it('should render the component', () => {
        cy.get('app-summary-action-bar')
          .should('exist')
          .should('be.visible')
          .screenshot(
            `summaryactionbarcomponent-summaryactionbar--summary-action-bar-${theme}`
          )
          .percySnapshot(
            `summaryactionbarcomponent-summaryactionbar--summary-action-bar-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
