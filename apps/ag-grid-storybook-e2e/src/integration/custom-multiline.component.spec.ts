['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=custommultilinecomponent-custommultiline--custom-multiline`
      )
    );
    it('should render the component', () => {
      cy.get('app-custom-multiline')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `custommultilinecomponent-custommultiline--custom-multiline-${theme}`
        )
        .percySnapshot(
          `custommultilinecomponent-custommultiline--custom-multiline-${theme}`
        );
    });
  });
});
