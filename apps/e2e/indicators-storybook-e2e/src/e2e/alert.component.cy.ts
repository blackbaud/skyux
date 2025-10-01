import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`indicators-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=alertcomponent-alert--alert`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-alert').screenshot(
          `alertcomponent-alert--alert-${theme}`,
        );
        cy.get('app-alert').percySnapshot(
          `alertcomponent-alert--alert-${theme}`,
        );
        for (const x of ['info', 'success', 'warning', 'danger']) {
          cy.get(`.sky-alert-${x}.sky-alert-closeable > .sky-alert-close`)
            .should('be.visible')
            .click();
          cy.get(`.sky-alert-${x}.sky-alert-closeable`).should(
            'not.be.visible',
          );
        }
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
