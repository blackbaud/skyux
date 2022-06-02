describe('tabs-showcase', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=components-tabs-tabs--tabs&args=')
  );

  it('should render the component', () => {
    cy.get('#screenshot-tabset')
      .should('exist')
      .should('be.visible')
      .should('include.text', 'Tab 2 Content')
      .screenshot()
      .percySnapshot('tabs');

    cy.get('#screenshot-tabset-long')
      .should('exist')
      .should('be.visible')
      .should('include.text', 'Tab 1 Content')
      .screenshot()
      .percySnapshot('tabs-long-title');
  });
});
