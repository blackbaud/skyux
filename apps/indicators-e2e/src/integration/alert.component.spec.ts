describe('indicators', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=components-indicators-alert--warning&args=')
  );
  it('should render the component', () => {
    cy.get('sky-alert').should('exist').screenshot().percySnapshot('sky-alert');
  });
});
