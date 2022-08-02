['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`datetime-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=datepipewithprovidervisualcomponent-datepipewithprovidervisual--date-pipe-with-provider-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-date-pipe-with-provider-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `datepipewithprovidervisualcomponent-datepipewithprovidervisual--date-pipe-with-provider-visual-${theme}`
        )
        .percySnapshot(
          `datepipewithprovidervisualcomponent-datepipewithprovidervisual--date-pipe-with-provider-visual-${theme}`
        );
    });
  });
});
