['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`datetime-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=fuzzydatepickervisualcomponent-fuzzydatepickervisual--fuzzy-datepicker`
      )
    );
    it('should render the component', () => {
      cy.get('app-fuzzy-datepicker-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `fuzzydatepickervisualcomponent-fuzzydatepickervisual--fuzzy-datepicker-${theme}`
        )
        .percySnapshot(
          `fuzzydatepickervisualcomponent-fuzzydatepickervisual--fuzzy-datepicker-${theme}`
        );
    });
  });
});
