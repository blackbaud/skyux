describe('indicators', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=skyalertcomponent--primary&args=alertType;closeable;closed;'
    )
  );
  it('should render the component', () => {
    cy.get('sky-alert').should('exist').screenshot().percySnapshot('sky-alert');
  });
});
