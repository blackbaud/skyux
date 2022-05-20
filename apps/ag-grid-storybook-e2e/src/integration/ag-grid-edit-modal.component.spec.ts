describe('ag-grid-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=skyaggrideditmodalcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-demo-edit-modal-form').should('exist');
  });
});
