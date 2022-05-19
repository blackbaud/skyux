describe('flyout-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=flyoutresponsivedemocomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-flyout-responsive-demo').should('exist');
  });
});
