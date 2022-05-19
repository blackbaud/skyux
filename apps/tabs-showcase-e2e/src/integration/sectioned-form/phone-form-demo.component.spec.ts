describe('tabs-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=skyphoneformdemocomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-phone-form-demo').should('exist');
  });
});
