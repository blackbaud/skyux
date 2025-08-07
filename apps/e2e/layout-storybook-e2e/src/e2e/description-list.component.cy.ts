import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('layout-storybook - description-list', () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      // TODO: make new array with Lg and Xs widths
      E2eVariations.DISPLAY_WIDTHS.concat(E2eVariations.MOBILE_WIDTHS).forEach(
        (width) => {
          describe(`at ${width}px`, () => {
            beforeEach(() => {
              cy.viewport(width, 960);
              cy.visit(
                `/iframe.html?globals=theme:${theme}&id=descriptionlistcomponent-descriptionlist--description-list`,
              );
            });

            it('should render the component', () => {
              cy.skyReady('app-description-list').screenshot(
                `descriptionlistcomponent-descriptionlist--description-list-${width}-${theme}`,
              );
              cy.percySnapshot(
                `descriptionlistcomponent-descriptionlist--description-list-${width}-${theme}`,
                {
                  widths: [width],
                },
              );
            });
          });
        },
      );
    });
  });
});
