describe('ag-grid-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=skyaggriddemocomponent--primary'));
  it('should render the component', () => {
    cy.get('app-ag-grid-demo').should('exist');
  });
});
