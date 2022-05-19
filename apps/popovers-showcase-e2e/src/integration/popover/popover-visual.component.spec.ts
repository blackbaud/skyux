describe('popovers-showcase', () => {
  beforeEach(() => cy.visit('/iframe.html?id=popovervisualcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-popover-visual').should('exist');
  });
});
