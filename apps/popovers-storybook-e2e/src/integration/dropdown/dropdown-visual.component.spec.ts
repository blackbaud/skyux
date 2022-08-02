['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`popovers-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=dropdownvisualcomponent-dropdownvisual--dropdown-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-dropdown-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `dropdownvisualcomponent-dropdownvisual--dropdown-visual-${theme}`
        )
        .percySnapshot(
          `dropdownvisualcomponent-dropdownvisual--dropdown-visual-${theme}`
        );
    });
  });
});
