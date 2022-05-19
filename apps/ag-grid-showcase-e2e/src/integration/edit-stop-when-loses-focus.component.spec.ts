describe('ag-grid-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=editstopwhenlosesfocuscomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-edit-stop-when-loses-focus-visual').should('exist');
  });
});
