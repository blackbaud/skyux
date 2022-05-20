describe('ag-grid-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=readonlygridcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-readonly-grid-visual').should('exist');
  });
});
