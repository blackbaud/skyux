['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`lists-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=filtervisualcomponent-filtervisual--filter`
      )
    );
    it('should render the component', () => {
      cy.get('app-filter-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(`filtervisualcomponent-filtervisual--filter-${theme}`)
        .percySnapshot(`filtervisualcomponent-filtervisual--filter-${theme}`);
    });
  });
});
