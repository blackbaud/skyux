import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('data-manager-storybook', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      ['view-1', 'view-2'].forEach((view) => {
        describe(`in view "${view}"`, () => {
          beforeEach(() =>
            cy.visit(
              `/iframe.html?globals=theme:${theme}&id=datamanagercomponent-datamanager--data-manager-${view}`,
            ),
          );
          it(`should render the component`, () => {
            cy.skyReady('app-data-manager').screenshot(
              `datamanagercomponent-datamanager--data-manager-${view}-${theme}`,
            );
            cy.get('app-data-manager').percySnapshot(
              `datamanagercomponent-datamanager--data-manager-${view}-${theme}`,
              {
                widths: E2eVariations.DISPLAY_WIDTHS,
              },
            );
          });
        });
      });
    });
  }, true);
});
