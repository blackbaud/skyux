['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=editstopwhenlosesfocuscomponent-editstopwhenlosesfocus--edit-stop-when-loses-focus`
      )
    );
    it('should render the component', () => {
      cy.get('app-edit-stop-when-loses-focus-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `editstopwhenlosesfocuscomponent-editstopwhenlosesfocus--edit-stop-when-loses-focus-${theme}`
        )
        .percySnapshot(
          `editstopwhenlosesfocuscomponent-editstopwhenlosesfocus--edit-stop-when-loses-focus-${theme}`
        );
    });
  });
});
