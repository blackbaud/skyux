['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`datetime-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=datepickervisualcomponent-datepickervisual--datepicker-visual`
      )
    );
    it('should render the component', () => {
      cy.get('app-datepicker-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `datepickervisualcomponent-datepickervisual--datepicker-visual-${theme}`
        )
        .percySnapshot(
          `datepickervisualcomponent-datepickervisual--datepicker-visual-${theme}`
        );
    });
  });
});
