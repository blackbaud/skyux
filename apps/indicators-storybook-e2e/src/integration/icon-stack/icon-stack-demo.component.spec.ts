describe('indicators-storybook', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?args=&id=components-indicators-icon-stack--icon-stack'
    )
  );
  it('should render the component', () => {
    cy.get('app-icon-stack-demo')
      .should('exist')
      .should('be.visible')
      .screenshot()
      .percySnapshot();
  });
});
