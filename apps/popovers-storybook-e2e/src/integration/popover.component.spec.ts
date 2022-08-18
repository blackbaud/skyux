['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`popovers-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy
        .viewport(1280, 2000)
        .visit(
          `/iframe.html?globals=theme:${theme}&id=popovercomponent-popover--popover`
        )
    );
    it('should render the component', () => {
      cy.get('.popover-message')
        .should('exist')
        .should('be.visible')
        .should('have.length', 16);

      // Capture the window viewport instead of the element; otherwise the popover
      // elements shift when taking a screenshot.
      cy.screenshot(`popovercomponent-popover--popover-${theme}`, {
        capture: 'viewport',
      }).percySnapshot(`popovercomponent-popover--popover-${theme}`, {
        widths: [1280],
      });
    });
  });
});
