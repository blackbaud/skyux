describe('tabs-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=verticaltabsvisualcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-vertical-tabs-visual').should('exist');
  });
});
