describe('flyout-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=flyoutmodaldemocomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-flyout-modal-demo').should('exist');
  });
});
