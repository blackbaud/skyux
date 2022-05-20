describe('tabs-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=skyinformationformdemocomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-information-form-demo').should('exist');
  });
});
