import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('indicators-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=keyinfocomponent-keyinfo--key-info`,
        ),
      );
      it('should render the component', () => {
        cy.skyReady('app-key-info').screenshot(
          `keyinfocomponent-keyinfo--key-info-${theme}`,
        );
        cy.get('app-key-info').percySnapshot(
          `keyinfocomponent-keyinfo--key-info-${theme}`,
        );
        for (const x of ['vertical', 'horizontal']) {
          cy.get(`.${x}-key-info`).should('exist').should('be.visible');
        }
      });
    });
  });
});
