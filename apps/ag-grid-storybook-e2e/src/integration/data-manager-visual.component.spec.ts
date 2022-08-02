['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=datamanagervisualcomponent-datamanagervisual--data-manager-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-data-manager-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `datamanagervisualcomponent-datamanagervisual--data-manager-visual-${theme}`
        )
        .percySnapshot(
          `datamanagervisualcomponent-datamanagervisual--data-manager-visual-${theme}`
        );
    });
  });
});
