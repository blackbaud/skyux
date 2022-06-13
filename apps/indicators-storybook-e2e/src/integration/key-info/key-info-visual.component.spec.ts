describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?args=&id=components-indicators-key-info--key-info')
  );
  it('should render the component', () => {
    cy.get('app-key-info-visual')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
