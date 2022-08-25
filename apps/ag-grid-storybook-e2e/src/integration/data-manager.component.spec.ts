['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook data manager in ${theme} theme`, () => {
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
          cy.document().its('fonts.status').should('equal', 'loaded');
        });

        it(`should render ag-grid with data manager, ${label} layout`, () => {
          cy.get('#ready')
            .should('exist')
            .end()
            .get('#root')
            .should('exist')
            .should('be.visible')
            .screenshot(
              `datamanagercomponent-datamanager--data-manager-${domLayout}-${theme}`
            )
            .percySnapshot(
              `datamanagercomponent-datamanager--data-manager-${domLayout}-${theme}`,
              {
                widths: [1280],
              }
            );
        });
      });
    });
  });
});
