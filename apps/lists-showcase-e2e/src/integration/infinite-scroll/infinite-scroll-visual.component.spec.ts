describe('lists-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=infinitescrollvisualcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-infinite-scroll-visual').should('exist');
  });
});
