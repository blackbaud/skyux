['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`datetime-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=daterangepickervisualcomponent-daterangepickervisual--date-range-picker`
      )
    );
    it('should render the component', () => {
      cy.get('app-date-range-picker-visual')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `daterangepickervisualcomponent-daterangepickervisual--date-range-picker-${theme}`
        )
        .percySnapshot(
          `daterangepickervisualcomponent-daterangepickervisual--date-range-picker-${theme}`
        );
    });
  });
});
