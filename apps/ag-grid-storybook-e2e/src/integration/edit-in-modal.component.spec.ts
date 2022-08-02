['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=editinmodalcomponent-editinmodal--edit-in-modal`
      )
    );
    it('should render the component', () => {
      cy.get('app-edit-in-modal')
        .should('exist')
        .should('be.visible')
        .screenshot(`editinmodalcomponent-editinmodal--edit-in-modal-${theme}`)
        .percySnapshot(
          `editinmodalcomponent-editinmodal--edit-in-modal-${theme}`
        );
    });
  });
});
