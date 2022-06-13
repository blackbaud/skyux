describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?args=&id=components-indicators-wait--wait')
  );
  it('should render the component', () => {
    cy.get('app-wait-demo')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
