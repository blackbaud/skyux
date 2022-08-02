['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`lists-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=pagingvisualcomponent-pagingvisual--paging-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-paging-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `pagingvisualcomponent-pagingvisual--paging-visual-${theme}`
        )
        .percySnapshot(
          `pagingvisualcomponent-pagingvisual--paging-visual-${theme}`
        );
    });
  });
});
