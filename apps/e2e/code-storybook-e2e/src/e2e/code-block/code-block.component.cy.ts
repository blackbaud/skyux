import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('Code Block', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=code-blockcomponent--code-block`,
        ),
      );

      it('should render the component', () => {
        cy.skyReady('app-code-block');
        cy.get('#screenshot-wrapper')
          .should('exist')
          .should('be.visible')
          .screenshot(`code-block-${theme}`);
        cy.percySnapshot(`code-block-${theme}`, {
          scope: '#screenshot-wrapper',
          widths: E2eVariations.DISPLAY_WIDTHS,
        });
      });

      // Percy's DOM snapshots don't keep focus, so the focus ring is captured
      // as a screenshot.
      it('should render the focused code area', () => {
        cy.skyReady('app-code-block');
        cy.get('#screenshot-wrapper sky-code-block pre code').first().focus();
        cy.get('#screenshot-wrapper sky-code-block')
          .first()
          .skyVisualTest(`code-block-focus-${theme}`, {
            overwrite: true,
            disableTimersAndAnimations: true,
          });
      });
    });
  });
});
