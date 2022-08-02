['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`popovers-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=popovervisualcomponent-popovervisual--popover`
      )
    );
    it('should render the component', () => {
      cy.get('app-popover-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(`popovervisualcomponent-popovervisual--popover-${theme}`)
        .percySnapshot(
          `popovervisualcomponent-popovervisual--popover-${theme}`
        );
    });
  });
});
