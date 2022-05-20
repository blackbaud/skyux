describe('flyout-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=flyoutvisualcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-flyout-visual').should('exist');
  });
});
