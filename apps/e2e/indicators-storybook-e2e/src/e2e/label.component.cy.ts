import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`indicators-storybook`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=labelcomponent-label--label`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-label').screenshot(
          `labelcomponent-label--label-${theme}`,
        );
        cy.get('app-label').percySnapshot(
          `labelcomponent-label--label-${theme}`,
        );
      });
    });
  });

  afterEach(() => {
    cy.skyCaptureIconNames();
  });
});
