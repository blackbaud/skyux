describe('lists-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=pagingvisualcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-paging-visual').should('exist');
  });
});
