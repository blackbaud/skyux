['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`tabs-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=tabsvisualcomponent-tabsvisual--tabs-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-tabs-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(`tabsvisualcomponent-tabsvisual--tabs-visual-${theme}`)
        .percySnapshot(`tabsvisualcomponent-tabsvisual--tabs-visual-${theme}`);
    });
  });
});
