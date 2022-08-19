['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`popovers-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy
        .viewport(1280, 800)
        .visit(
          `/iframe.html?globals=theme:${theme}&id=popovercomponent-popover--popover`
        )
    );
    it('should render the component', () => {
      cy.get('#popovers-ready').should('exist');

      cy.get('.popover-message')
        .should('exist')
        .should('be.visible')
        .should('have.length', 16);

      cy.get('body')
        .screenshot(`popovercomponent-popover--popover-${theme}`)
        .percySnapshot(`popovercomponent-popover--popover-${theme}`, {
          widths: [1280],
        });
    });
  });
});
