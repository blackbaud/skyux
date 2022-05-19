describe('tabs-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=skyaddressformdemocomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-address-form-demo').should('exist');
  });
});
