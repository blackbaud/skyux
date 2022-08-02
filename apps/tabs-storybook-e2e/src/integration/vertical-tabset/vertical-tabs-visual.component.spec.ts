['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`tabs-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=verticaltabsvisualcomponent-verticaltabsvisual--vertical-tabs-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-vertical-tabs-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `verticaltabsvisualcomponent-verticaltabsvisual--vertical-tabs-visual-${theme}`
        )
        .percySnapshot(
          `verticaltabsvisualcomponent-verticaltabsvisual--vertical-tabs-visual-${theme}`
        );
    });
  });
});
