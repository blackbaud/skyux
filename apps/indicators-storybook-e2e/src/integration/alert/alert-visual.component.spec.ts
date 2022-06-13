describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?args=&id=components-indicators-alert--alert')
  );
  it('should render the component', () => {
    cy.get('app-alert-visual')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
