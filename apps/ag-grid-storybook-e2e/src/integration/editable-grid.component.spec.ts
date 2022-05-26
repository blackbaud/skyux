describe('ag-grid-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=components-ag-grid-data-entry-grid--data-entry-grid&args=&viewMode=story'
    )
  );
  it('should render the component', () => {
    cy.get('app-editable-grid-visual')
      .should('exist')
      .screenshot()
      .percySnapshot('data-entry-grid');
  });
});
