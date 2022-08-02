['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=readonlygridcontextmenucomponent-readonlygridcontextmenu--readonly-grid-context-menu`
      )
    );
    it('should render the component', () => {
      cy.get('app-readonly-grid-context-menu')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `readonlygridcontextmenucomponent-readonlygridcontextmenu--readonly-grid-context-menu-${theme}`
        )
        .percySnapshot(
          `readonlygridcontextmenucomponent-readonlygridcontextmenu--readonly-grid-context-menu-${theme}`
        );
    });
  });
});
