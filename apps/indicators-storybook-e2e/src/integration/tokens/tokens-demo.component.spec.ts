describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?args=&id=components-indicators-tokens--tokens')
  );
  it('should render the component', () => {
    cy.get('app-tokens-demo')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
