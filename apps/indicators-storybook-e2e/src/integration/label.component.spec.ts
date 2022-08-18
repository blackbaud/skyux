['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`indicators-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=labelcomponent-label--label`
      )
    );
    it('should render the component', () => {
      cy.get('app-label')
        .should('exist')
        .should('be.visible')
        .screenshot(`labelcomponent-label--label-${theme}`)
        .percySnapshot(`labelcomponent-label--label-${theme}`);
    });
  });
});
