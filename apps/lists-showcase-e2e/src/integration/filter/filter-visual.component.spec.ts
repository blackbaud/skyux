describe('lists-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=filtervisualcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-filter-visual').should('exist');
  });
});
