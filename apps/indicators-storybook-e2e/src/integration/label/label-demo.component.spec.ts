describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?args=&id=components-indicators-label--label')
  );
  it('should render the component', () => {
    cy.get('app-label-demo')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
