describe('flyout-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=flyoutresponsivedemocontentcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-flyout-responsive-demo-content').should('exist');
  });
});
