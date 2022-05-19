describe('tabs-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=verticaltabsetmodalvisualcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-vertical-tabset-modal-visual').should('exist');
  });
});
