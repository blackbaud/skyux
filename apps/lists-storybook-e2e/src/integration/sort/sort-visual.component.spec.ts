describe('lists-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=sortvisualcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-sort-visual').should('exist');
  });
});
