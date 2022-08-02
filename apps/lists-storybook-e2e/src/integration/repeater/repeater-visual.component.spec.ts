['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`lists-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=repeatervisualcomponent-repeatervisual--repeater-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-repeater-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `repeatervisualcomponent-repeatervisual--repeater-visual-${theme}`
        )
        .percySnapshot(
          `repeatervisualcomponent-repeatervisual--repeater-visual-${theme}`
        );
    });
  });
});
