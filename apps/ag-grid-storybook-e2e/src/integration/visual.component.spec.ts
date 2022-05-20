describe('ag-grid-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=visualcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-visual').should('exist');
  });
});
