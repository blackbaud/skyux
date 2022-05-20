describe('ag-grid-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=dataviewrepeatercomponent--primary&args=items;')
  );
  it('should render the component', () => {
    cy.get('app-data-view-repeater').should('exist');
  });
});
