['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=skydatamanagerfiltersmodalvisualcomponent-skydatamanagerfiltersmodalvisual--sky-data-manager-filters-modal-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-demo-filter-modal-form')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `skydatamanagerfiltersmodalvisualcomponent-skydatamanagerfiltersmodalvisual--sky-data-manager-filters-modal-visual-${theme}`
        )
        .percySnapshot(
          `skydatamanagerfiltersmodalvisualcomponent-skydatamanagerfiltersmodalvisual--sky-data-manager-filters-modal-visual-${theme}`
        );
    });
  });
});
