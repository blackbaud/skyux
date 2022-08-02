['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`flyout-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=flyoutvisualcomponent-flyoutvisual--flyout-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-flyout-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `flyoutvisualcomponent-flyoutvisual--flyout-visual-${theme}`
        )
        .percySnapshot(
          `flyoutvisualcomponent-flyoutvisual--flyout-visual-${theme}`
        );
    });
  });
});
