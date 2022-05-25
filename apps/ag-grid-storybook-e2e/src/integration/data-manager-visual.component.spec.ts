describe('ag-grid-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=components-ag-grid-data-manager--data-manager&args=&viewMode=story'
    )
  );
  it('should render the component', () => {
    cy.get('app-data-manager-visual').should('exist');
  });
});
