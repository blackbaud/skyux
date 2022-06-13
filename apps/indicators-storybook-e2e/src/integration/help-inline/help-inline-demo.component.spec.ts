describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?args=&id=components-indicators-help-inline--help-inline'
    )
  );
  it('should render the component', () => {
    cy.get('app-help-inline-demo')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
