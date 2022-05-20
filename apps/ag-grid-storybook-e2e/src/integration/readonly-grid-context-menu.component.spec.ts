describe('ag-grid-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=readonlygridcontextmenucomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-readonly-grid-context-menu').should('exist');
  });
});
