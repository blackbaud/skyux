describe('lists-storybook', () => {
  beforeEach(() => cy.visit('/iframe.html?id=components-lists--paging&args='));
  it('should render the component', () => {
    cy.get('app-paging-visual').should('exist');
  });
});
