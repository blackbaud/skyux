describe('ag-grid-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=editcomplexcellscomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-edit-complex-cells-visual').should('exist');
  });
});
