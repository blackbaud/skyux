describe('lists-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=repeatervisualcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-repeater-visual').should('exist');
  });
});
