describe('ag-grid-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=dataviewgridcomponent--primary&args=items;')
  );
  it('should render the component', () => {
    cy.get('app-data-view-grid').should('exist');
  });
});
