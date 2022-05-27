describe('tabs-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=components-tabs-tabs--tabs&args=')
  );
  it('should render the component', () => {
    cy.get('app-tabs-visual')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot('tabs');
  });
});
