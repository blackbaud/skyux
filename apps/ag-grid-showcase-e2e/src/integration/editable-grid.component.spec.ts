describe('ag-grid-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=editablegridcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-editable-grid-visual').should('exist');
  });
});
