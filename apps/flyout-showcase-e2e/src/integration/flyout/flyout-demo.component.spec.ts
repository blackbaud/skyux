describe('flyout-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=flyoutdemocomponent--primary'));
  it('should render the component', () => {
    cy.get('app-flyout-demo').should('exist');
  });
});
