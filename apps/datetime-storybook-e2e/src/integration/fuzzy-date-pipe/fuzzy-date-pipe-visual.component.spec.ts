['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`datetime-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=fuzzydatepipevisualcomponent-fuzzydatepipevisual--fuzzy-date-pipe-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-fuzzy-date-pipe-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `fuzzydatepipevisualcomponent-fuzzydatepipevisual--fuzzy-date-pipe-visual-${theme}`
        )
        .percySnapshot(
          `fuzzydatepipevisualcomponent-fuzzydatepipevisual--fuzzy-date-pipe-visual-${theme}`
        );
    });
  });
});
