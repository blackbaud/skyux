['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=editcomplexcellscomponent-editcomplexcells--edit-complex-cells`
      )
    );
    it('should render the component', () => {
      cy.get('app-edit-complex-cells-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `editcomplexcellscomponent-editcomplexcells--edit-complex-cells-${theme}`
        )
        .percySnapshot(
          `editcomplexcellscomponent-editcomplexcells--edit-complex-cells-${theme}`
        );
    });
  });
});
