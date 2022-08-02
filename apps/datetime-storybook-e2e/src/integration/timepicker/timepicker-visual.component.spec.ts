['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`datetime-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=timepickervisualcomponent-timepickervisual--timepicker`
      )
    );
    it('should render the component', () => {
      cy.get('app-timepicker-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `timepickervisualcomponent-timepickervisual--timepicker-${theme}`
        )
        .percySnapshot(
          `timepickervisualcomponent-timepickervisual--timepicker-${theme}`
        );
    });
  });
});
