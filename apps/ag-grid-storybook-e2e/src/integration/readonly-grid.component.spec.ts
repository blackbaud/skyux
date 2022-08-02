['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=readonlygridcomponent-readonlygrid--readonly-grid`
      )
    );
    it('should render the component', () => {
      cy.get('app-readonly-grid-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `readonlygridcomponent-readonlygrid--readonly-grid-${theme}`
        )
        .percySnapshot(
          `readonlygridcomponent-readonlygrid--readonly-grid-${theme}`
        );
    });
  });
});
