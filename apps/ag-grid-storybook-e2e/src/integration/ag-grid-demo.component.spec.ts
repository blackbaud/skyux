['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=skyaggriddemocomponent-skyaggriddemo--sky-ag-grid-demo`
      )
    );
    it('should render the component', () => {
      cy.get('app-ag-grid-demo')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `skyaggriddemocomponent-skyaggriddemo--sky-ag-grid-demo-${theme}`
        )
        .percySnapshot(
          `skyaggriddemocomponent-skyaggriddemo--sky-ag-grid-demo-${theme}`
        );
    });
  });
});
