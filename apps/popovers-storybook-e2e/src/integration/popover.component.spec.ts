['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`popovers-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=popovercomponent-popover--popover`
      )
    );
    it('should render the component', () => {
      cy.get('app-popover')
        .should('exist')
        .should('be.visible')
        .screenshot(`popovercomponent-popover--popover-${theme}`)
        .percySnapshot(`popovercomponent-popover--popover-${theme}`);
    });
  });
});
