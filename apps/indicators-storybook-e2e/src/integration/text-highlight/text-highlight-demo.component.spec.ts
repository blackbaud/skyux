describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?args=&id=components-indicators-text-highlight--text-highlight'
    )
  );
  it('should render the component', () => {
    cy.get('app-text-highlight-demo')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
