['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`tabs-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=sectionedformvisualcomponent-sectionedformvisual--sectioned-form-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-sectioned-form-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `sectionedformvisualcomponent-sectionedformvisual--sectioned-form-visual-${theme}`
        )
        .percySnapshot(
          `sectionedformvisualcomponent-sectionedformvisual--sectioned-form-visual-${theme}`
        );
    });
  });
});
