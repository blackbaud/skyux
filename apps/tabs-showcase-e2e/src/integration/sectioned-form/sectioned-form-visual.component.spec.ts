describe('tabs-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=sectionedformvisualcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-sectioned-form-visual').should('exist');
  });
});
