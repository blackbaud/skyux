import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('data-manager-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['view-1', 'view-2'].forEach((view) => {
        describe(`in view "${view}"`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=datamanagercomponent-datamanager--data-manager-${view}`
            )
          );
          it(`should render the component`, () => {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.get('#ready')
              .should('exist')
              .end()
              .get('app-data-manager')
              .should('exist')
              .should('be.visible')
              .screenshot(
                `datamanagercomponent-datamanager--data-manager-${view}-${theme}`
              )
              .percySnapshot(
                `datamanagercomponent-datamanager--data-manager-${view}-${theme}`,
                {
                  widths: E2eVariations.DISPLAY_WIDTHS,
                }
              );
          });
        });
      });
    });
  });
});
