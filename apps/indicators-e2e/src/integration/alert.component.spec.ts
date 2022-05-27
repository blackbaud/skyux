describe('indicators', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=components-indicators-alert--warning&args=')
  );
  it('should render the component', () => {
    cy.get('sky-alert')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot('sky-alert');
  });
});
