['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`pages-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=pageheadervisualcomponent-pageheadervisual--page-header`
      )
    );
    it('should render the component', () => {
      cy.get('app-page-header-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `pageheadervisualcomponent-pageheadervisual--page-header-${theme}`
        )
        .percySnapshot(
          `pageheadervisualcomponent-pageheadervisual--page-header-${theme}`
        );
    });
  });
});
