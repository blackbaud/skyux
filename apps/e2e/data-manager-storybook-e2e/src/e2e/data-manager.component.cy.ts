import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('data-manager-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      beforeEach(() =>
        cy.visit(
          `/iframe.html?globals=theme:${theme}&id=datamanagercomponent-datamanager--data-manager`
        )
      );
      it('should render the component', () => {
        cy.get('app-data-manager')
          .should('exist')
          .should('be.visible')
          .screenshot(`datamanagercomponent-datamanager--data-manager-${theme}`)
          .percySnapshot(
            `datamanagercomponent-datamanager--data-manager-${theme}`,
            {
              widths: E2eVariations.DISPLAY_WIDTHS,
            }
          );
      });
    });
  });
});
