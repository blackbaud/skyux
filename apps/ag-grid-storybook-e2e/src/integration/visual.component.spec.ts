['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=visualcomponent-visual--visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(`visualcomponent-visual--visual-${theme}`)
        .percySnapshot(`visualcomponent-visual--visual-${theme}`);
    });
  });
});
