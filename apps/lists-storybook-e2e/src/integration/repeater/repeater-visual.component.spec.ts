describe('lists-storybook', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=components-lists--repeater&args=')
  );
  it('should render the component', () => {
    cy.get('app-repeater-visual').should('exist');
  });
});
