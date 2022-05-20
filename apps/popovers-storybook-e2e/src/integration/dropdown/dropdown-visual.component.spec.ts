describe('popovers-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=dropdownvisualcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-dropdown-visual').should('exist');
  });
});
