describe('ag-grid-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=datamanagervisualcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-data-manager-visual').should('exist');
  });
});
