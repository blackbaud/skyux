describe('ag-grid-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=components-ag-grid-data-grid--data-grid&args=&viewMode=story'
    )
  );
  it('should render the component', () => {
    cy.get('app-readonly-grid-visual').should('exist');
  });
});
