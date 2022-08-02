['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`lists-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=sortvisualcomponent-sortvisual--sort`
      )
    );
    it('should render the component', () => {
      cy.get('app-sort-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(`sortvisualcomponent-sortvisual--sort-${theme}`)
        .percySnapshot(`sortvisualcomponent-sortvisual--sort-${theme}`);
    });
  });
});
