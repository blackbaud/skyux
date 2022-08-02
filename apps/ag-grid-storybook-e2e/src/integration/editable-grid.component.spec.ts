['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=editablegridcomponent-editablegrid--editable-grid`
      )
    );
    it('should render the component', () => {
      cy.get('app-editable-grid-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `editablegridcomponent-editablegrid--editable-grid-${theme}`
        )
        .percySnapshot(
          `editablegridcomponent-editablegrid--editable-grid-${theme}`
        );
    });
  });
});
