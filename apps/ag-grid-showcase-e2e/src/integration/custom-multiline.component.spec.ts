describe('ag-grid-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=custommultilinecomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-custom-multiline').should('exist');
  });
});
