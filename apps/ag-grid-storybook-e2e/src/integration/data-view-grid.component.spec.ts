['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=dataviewgridcomponent-dataviewgrid--data-view-grid&args=items;`
      )
    );
    it('should render the component', () => {
      cy.get('app-data-view-grid')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `dataviewgridcomponent-dataviewgrid--data-view-grid-${theme}`
        )
        .percySnapshot(
          `dataviewgridcomponent-dataviewgrid--data-view-grid-${theme}`
        );
    });
  });
});
