describe('ag-grid-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=components-ag-grid-data-manager--data-manager&args=&viewMode=story'
    )
  );
  it('should render the component', () => {
    cy.get('sky-data-manager')
      .should('exist')
      .should('be.visible')
      .should('include.text', 'Select all')
      .should('include.text', 'Clear all')
      .should('include.text', 'Show only selected items')
      .screenshot()
      .percySnapshot('data-manager');
  });
});
