['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy.visit(
        `/iframe.html?globals=theme:${theme}&id=dataviewrepeatercomponent-dataviewrepeater--data-view-repeater&args=items;`
      )
    );
    it('should render the component', () => {
      cy.get('app-data-view-repeater')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `dataviewrepeatercomponent-dataviewrepeater--data-view-repeater-${theme}`
        )
        .percySnapshot(
          `dataviewrepeatercomponent-dataviewrepeater--data-view-repeater-${theme}`
        );
    });
  });
});
