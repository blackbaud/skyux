['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`pages-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=actionhubvisualcomponent-actionhubvisual--action-hub`
      )
    );
    it('should render the component', () => {
      cy.get('app-action-hub-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `actionhubvisualcomponent-actionhubvisual--action-hub-${theme}`
        )
        .percySnapshot(
          `actionhubvisualcomponent-actionhubvisual--action-hub-${theme}`
        );
    });
  });
});
