describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?args=&id=components-indicators-status-indicator--status-indicator'
    )
  );
  it('should render the component', () => {
    cy.get('app-status-indicator-visual')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
