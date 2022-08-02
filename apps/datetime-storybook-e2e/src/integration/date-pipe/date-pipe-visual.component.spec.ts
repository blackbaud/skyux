['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`datetime-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=datepipevisualcomponent-datepipevisual--date-pipe-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-date-pipe-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `datepipevisualcomponent-datepipevisual--date-pipe-visual-${theme}`
        )
        .percySnapshot(
          `datepipevisualcomponent-datepipevisual--date-pipe-visual-${theme}`
        );
    });
  });
});
