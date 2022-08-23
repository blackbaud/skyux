['default', 'modern-light', 'modern-dark'].forEach((theme) => {
  describe(`ag-grid-storybook in ${theme} theme`, () => {
    beforeEach(() =>
      cy
        .viewport(1300, 900)
        .visit(
          `/iframe.html?globals=theme:${theme}&id=aggridstoriescomponent-aggridstories--ag-grid`
        )
    );

    it('should render the component', () => {
      cy.get('#ready')
        .should('exist')
        .end()
        .get('#root')
        .should('exist')
        .should('be.visible')
        .screenshot(
          `aggridstoriescomponent-aggridstories--ag-grid-stories-${theme}`
        )
        .percySnapshot(
          `aggridstoriescomponent-aggridstories--ag-grid-stories-${theme}`,
          {
            widths: [1280],
          }
        );
    });
  });
});
