describe('tabs-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=tabsvisualcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-tabs-visual').should('exist');
  });
});
