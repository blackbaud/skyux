['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`pages-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=actionhubcomponent-actionhub--action-hub`
      )
    );
    it('should render the component', () => {
      cy.get('app-action-hub')
        .should('exist')
        .should('be.visible')
        .screenshot(`actionhubcomponent-actionhub--action-hub-${theme}`)
        .percySnapshot(`actionhubcomponent-actionhub--action-hub-${theme}`);
    });
  });
});
