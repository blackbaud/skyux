describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?args=&id=components-indicators-chevron--chevron')
  );
  it('should render the component', () => {
    cy.get('app-chevron-demo')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
