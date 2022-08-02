['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`lists-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=infinitescrollvisualcomponent-infinitescrollvisual--infinite-scroll-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-infinite-scroll-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `infinitescrollvisualcomponent-infinitescrollvisual--infinite-scroll-visual-${theme}`
        )
        .percySnapshot(
          `infinitescrollvisualcomponent-infinitescrollvisual--infinite-scroll-visual-${theme}`
        );
    });
  });
});
