import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe(`ag-grid-storybook data manager`, () => {
  E2eVariations.forEachTheme((theme) => {
    describe(`in ${theme} theme`, () => {
      [
        ['normal', 'normal'],
        ['normal-with-top-scroll', 'normal with top scroll'],
        ['auto-height', 'auto height'],
        ['auto-height-with-top-scroll', 'auto height with top scroll'],
      ].forEach(([domLayout, label]) => {
        describe(`${label} layout`, () => {
          beforeEach(() => {
            cy.viewport(1300, 900).visit(
              `/iframe.html?globals=theme:${theme}&id=datamanagercomponent-datamanager--data-manager-${domLayout}`
            );
            cy.waitForFaAndBbFonts();
          });

          it(`should render ag-grid with data manager, ${label} layout`, () => {
            cy.get('#ready')
              .should('exist')
              .end()
              .get('#root')
              .should('exist')
              .should('be.visible')
              .wait(500)
              .screenshot(
                `datamanagercomponent-datamanager--data-manager-${domLayout}-${theme}`,
                {
                  clip: { x: 0, y: 0, width: 1300, height: 600 },
                }
              )
              .percySnapshot(
                `datamanagercomponent-datamanager--data-manager-${domLayout}-${theme}`,
                {
                  widths: [1280],
                  scope: '#root',
                  percyCSS: `
                    /* Avoid "virtual rows" in the screenshot. */
                    #root {
                      height: 600px;
                    }
                  `,
                }
              );
          });
        });
      });
    });
  });
});
