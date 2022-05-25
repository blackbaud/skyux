describe('lists-storybook', () => {
  beforeEach(() => cy.visit('/iframe.html?id=components-lists--sort&args='));
  it('should render the component', () => {
    cy.get('app-sort-visual').should('exist');
  });
});
