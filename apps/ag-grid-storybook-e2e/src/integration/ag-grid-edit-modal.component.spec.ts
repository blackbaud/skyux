['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=skyaggrideditmodalcomponent-skyaggrideditmodal--sky-ag-grid-edit-modal`
      )
    );
    it('should render the component', () => {
      cy.get('app-demo-edit-modal-form')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `skyaggrideditmodalcomponent-skyaggrideditmodal--sky-ag-grid-edit-modal-${theme}`
        )
        .percySnapshot(
          `skyaggrideditmodalcomponent-skyaggrideditmodal--sky-ag-grid-edit-modal-${theme}`
        );
    });
  });
});
