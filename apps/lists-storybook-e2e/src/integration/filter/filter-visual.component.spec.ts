describe('lists-storybook', () => {
  beforeEach(() => cy.visit('/iframe.html?id=components-lists--filter&args='));
  it('should render the component', () => {
    cy.get('app-filter-visual')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot('lists-filter');
  });
});
